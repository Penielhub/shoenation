from decimal import Decimal
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import and_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from ..database import get_db
from ..deps import require_admin
from ..models import Category, Gender, OrderItem, Product, ProductType, ProductVariant
from ..schemas import (
    CATEGORY_HELP,
    GENDER_HELP,
    PRODUCT_TYPE_HELP,
    ProductCreate,
    ProductOut,
    ProductPage,
    ProductUpdate,
    VariantIn,
    VariantOut,
    VariantUpdate,
    sale_price_problem,
)

router = APIRouter(prefix="/products", tags=["products"])

# price sorts use current_price, so a shoe on sale sorts by the price customers actually pay
SORTS = {
    "price_asc": Product.current_price.asc(),
    "price_desc": Product.current_price.desc(),
    "name": Product.name.asc(),
    "newest": Product.created_at.desc().nulls_last(),
}


def get_product_or_404(db: Session, product_id: int) -> Product:
    product = db.get(Product, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


def get_variant_or_404(db: Session, product_id: int, variant_id: int) -> ProductVariant:
    variant = db.get(ProductVariant, variant_id)
    if variant is None or variant.product_id != product_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Variant not found")
    return variant


def commit_or_409(db: Session):
    """The only constraint these writes can break is the unique (product, size, color) one."""
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="That size/color already exists for this product")


def ensure_never_ordered(db: Session, *conditions, what: str):
    # order_items point at variants, so deleting an ordered variant would break order history
    if db.query(OrderItem).join(ProductVariant).filter(*conditions).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"This {what} appears in past orders and can't be deleted. Set its stock to 0 instead.",
        )


@router.get("", response_model=ProductPage)
def list_products(
    db: Session = Depends(get_db),
    q: str | None = Query(None, description="Search in name and brand"),
    brand: str | None = None,
    category: Category | None = Query(None, description=CATEGORY_HELP),
    gender: Gender | None = Query(None, description=GENDER_HELP),
    is_kids: bool | None = Query(None, description="true = only kids' shoes, false = only adults'"),
    product_type: ProductType | None = Query(None, description=PRODUCT_TYPE_HELP),
    on_sale: bool | None = Query(None, description="true = only discounted products, false = only full price"),
    min_price: Decimal | None = Query(None, ge=0, description="Compared with current_price (the sale price when on sale)"),
    max_price: Decimal | None = Query(None, ge=0, description="Compared with current_price (the sale price when on sale)"),
    size: str | None = None,
    in_stock: bool = Query(False, description="Only products with stock left (in `size`, if given)"),
    sort: Literal["price_asc", "price_desc", "name", "newest"] | None = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    query = db.query(Product)
    if q:
        query = query.filter(Product.name.icontains(q, autoescape=True) | Product.brand.icontains(q, autoescape=True))
    if brand:
        query = query.filter(Product.brand.ilike(brand))
    if category is not None:
        query = query.filter(Product.category == category)
    if gender is not None:
        query = query.filter(Product.gender == gender)
    if is_kids is not None:
        query = query.filter(Product.is_kids == is_kids)
    if product_type is not None:
        query = query.filter(Product.product_type == product_type)
    if on_sale is not None:
        query = query.filter(Product.on_sale == on_sale)
    if min_price is not None:
        query = query.filter(Product.current_price >= min_price)
    if max_price is not None:
        query = query.filter(Product.current_price <= max_price)

    variant_conditions = []
    if size:
        variant_conditions.append(ProductVariant.size == size)
    if in_stock:
        variant_conditions.append(ProductVariant.stock > 0)
    if variant_conditions:
        # one variant has to match all of them, e.g. "size 9 AND in stock", not "has a 9" + "has stock in some size"
        query = query.filter(Product.variants.any(and_(*variant_conditions)))

    total = query.count()
    order = [SORTS[sort]] if sort else []
    items = (
        query.options(selectinload(Product.variants))
        .order_by(*order, Product.id)
        .offset(offset)
        .limit(limit)
        .all()
    )
    return ProductPage(items=items, total=total, limit=limit, offset=offset)


@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    return get_product_or_404(db, product_id)


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def create_product(data: ProductCreate, db: Session = Depends(get_db)):
    product = Product(
        **data.model_dump(exclude={"variants"}),
        variants=[ProductVariant(**v.model_dump()) for v in data.variants],
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.patch("/{product_id}", response_model=ProductOut, dependencies=[Depends(require_admin)])
def update_product(product_id: int, data: ProductUpdate, db: Session = Depends(get_db)):
    product = get_product_or_404(db, product_id)
    changes = data.model_dump(exclude_unset=True)
    if changes.get("on_sale") is False and "sale_price" not in changes:
        # ending a sale drops the old sale price, so the admin doesn't have to send both
        changes["sale_price"] = None
    for field, value in changes.items():
        setattr(product, field, value)
    # checked on the merged result: e.g. lowering price below an existing sale price is refused too
    problem = sale_price_problem(product.price, product.on_sale, product.sale_price)
    if problem:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail=problem)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = get_product_or_404(db, product_id)
    ensure_never_ordered(db, ProductVariant.product_id == product_id, what="product")
    db.delete(product)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/{product_id}/variants",
    response_model=VariantOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
def add_variant(product_id: int, data: VariantIn, db: Session = Depends(get_db)):
    get_product_or_404(db, product_id)
    variant = ProductVariant(product_id=product_id, **data.model_dump())
    db.add(variant)
    commit_or_409(db)
    db.refresh(variant)
    return variant


@router.patch("/{product_id}/variants/{variant_id}", response_model=VariantOut, dependencies=[Depends(require_admin)])
def update_variant(product_id: int, variant_id: int, data: VariantUpdate, db: Session = Depends(get_db)):
    variant = get_variant_or_404(db, product_id, variant_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(variant, field, value)
    commit_or_409(db)
    db.refresh(variant)
    return variant


@router.delete(
    "/{product_id}/variants/{variant_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
def delete_variant(product_id: int, variant_id: int, db: Session = Depends(get_db)):
    variant = get_variant_or_404(db, product_id, variant_id)
    ensure_never_ordered(db, ProductVariant.id == variant_id, what="variant")
    db.delete(variant)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
