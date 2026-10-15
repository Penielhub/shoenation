"""Placing and viewing orders. Users only ever see their own orders; admins see everyone's."""
from collections import Counter
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, selectinload

from ..database import get_db
from ..deps import get_current_user, require_admin
from ..models import Order, OrderItem, OrderStatus, ProductVariant, Role, User
from ..schemas import OrderCreate, OrderOut, OrderPage, OrderStatusUpdate

router = APIRouter(prefix="/orders", tags=["orders"])

# where an order is allowed to go next; any other change is refused
TRANSITIONS = {
    OrderStatus.PENDING: {OrderStatus.PAID, OrderStatus.CANCELLED},
    OrderStatus.PAID: {OrderStatus.SHIPPED, OrderStatus.CANCELLED},
    OrderStatus.SHIPPED: {OrderStatus.DELIVERED},
    OrderStatus.DELIVERED: set(),
    OrderStatus.CANCELLED: set(),
}

# loads everything OrderOut shows in a few queries, instead of one query per item
ORDER_DETAILS = (
    selectinload(Order.user),
    selectinload(Order.items).selectinload(OrderItem.variant).selectinload(ProductVariant.product),
)


def lock_variants(db: Session, variant_ids) -> dict[int, ProductVariant]:
    # FOR UPDATE makes any other checkout or cancel touching these variants wait until we commit,
    # so two people can't both buy the last pair. Locking in id order stops two requests deadlocking.
    rows = (
        db.query(ProductVariant)
        .filter(ProductVariant.id.in_(list(variant_ids)))
        .order_by(ProductVariant.id)
        .with_for_update()
        .all()
    )
    return {v.id: v for v in rows}


def get_order_for(db: Session, order_id: int, user: User, lock: bool = False) -> Order:
    query = db.query(Order).filter(Order.id == order_id)
    if lock:
        query = query.with_for_update()
    order = query.first()
    # someone else's order gets the same 404 as a missing one, so users can't probe other order ids
    if order is None or (user.role != Role.ADMIN and order.user_id != user.id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


def load_order(db: Session, order_id: int) -> Order:
    return db.query(Order).options(*ORDER_DETAILS).filter(Order.id == order_id).one()


def cancel_and_restock(db: Session, order: Order):
    variants = lock_variants(db, {item.variant_id for item in order.items})
    for item in order.items:
        variants[item.variant_id].stock += item.quantity
    order.status = OrderStatus.CANCELLED.value


@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def place_order(data: OrderCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    quantities = Counter()
    for item in data.items:
        quantities[item.variant_id] += item.quantity  # the same variant sent twice becomes one line

    variants = lock_variants(db, quantities)
    missing = sorted(set(quantities) - set(variants))
    if missing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Variant(s) not found: {missing}")
    short = [
        {"variant_id": vid, "requested": qty, "available": variants[vid].stock}
        for vid, qty in quantities.items()
        if variants[vid].stock < qty
    ]
    if short:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"message": "Not enough stock", "items": short})

    order = Order(user_id=user.id, status=OrderStatus.PENDING.value, total=Decimal("0"))
    for vid, qty in quantities.items():
        variant = variants[vid]
        variant.stock -= qty
        # the price paid (the sale price while on sale) is copied now, so later price changes don't alter this order
        order.items.append(OrderItem(variant_id=vid, quantity=qty, unit_price=variant.product.current_price))
    order.total = sum(item.unit_price * item.quantity for item in order.items)
    db.add(order)
    db.commit()
    return load_order(db, order.id)


@router.get("", response_model=OrderPage)
def list_orders(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    status_filter: OrderStatus | None = Query(None, alias="status"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    query = db.query(Order)
    if user.role != Role.ADMIN:
        query = query.filter(Order.user_id == user.id)
    if status_filter:
        query = query.filter(Order.status == status_filter.value)
    total = query.count()
    items = (
        query.options(*ORDER_DETAILS)
        .order_by(Order.created_at.desc(), Order.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return OrderPage(items=items, total=total, limit=limit, offset=offset)


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    get_order_for(db, order_id, user)
    return load_order(db, order_id)


@router.post("/{order_id}/cancel", response_model=OrderOut)
def cancel_order(order_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """A user can cancel their own order while it's still pending. Its stock goes back on sale."""
    order = get_order_for(db, order_id, user, lock=True)
    if order.status != OrderStatus.PENDING.value:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Only pending orders can be cancelled, this one is {order.status}",
        )
    cancel_and_restock(db, order)
    db.commit()
    return load_order(db, order_id)


@router.patch("/{order_id}/status", response_model=OrderOut)
def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Admin moves an order along: pending → paid → shipped → delivered, or cancels it before it ships."""
    order = get_order_for(db, order_id, admin, lock=True)
    current = OrderStatus(order.status)
    if data.status not in TRANSITIONS[current]:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Can't change a {current.value} order to {data.status.value}",
        )
    if data.status == OrderStatus.CANCELLED:
        cancel_and_restock(db, order)
    else:
        order.status = data.status.value
    db.commit()
    return load_order(db, order_id)
