import enum
from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    Enum,
    ForeignKey,
    Numeric,
    SmallInteger,
    String,
    Text,
    UniqueConstraint,
    case,
    false,
    func,
    text,
)
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Category(enum.IntEnum):
    """Stored as a small integer in products.category."""

    MEN = 1
    WOMEN = 2
    KIDS = 3
    UNISEX = 4


class ProductType(enum.IntEnum):
    """Stored as a small integer in products.product_type."""

    SHOE = 1
    MERCH = 2


class Product(Base):
    __tablename__ = "products"
    # the database itself refuses bad data, even if it's written by something other than this API
    __table_args__ = (
        CheckConstraint("category IN (1, 2, 3, 4)", name="ck_products_category_valid"),
        CheckConstraint("product_type IN (1, 2)", name="ck_products_product_type_valid"),
        CheckConstraint("price > 0", name="ck_products_price_positive"),
        CheckConstraint(
            "(NOT on_sale AND sale_price IS NULL)"
            " OR (on_sale AND sale_price IS NOT NULL AND sale_price > 0 AND sale_price < price)",
            name="ck_products_sale_price_valid",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    brand: Mapped[str] = mapped_column(String(100))
    description: Mapped[str | None] = mapped_column(Text)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    image_url: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), server_default=func.now())
    # one of Category's values; existing rows were backfilled as unisex
    category: Mapped[int] = mapped_column(SmallInteger, index=True, server_default=text(str(Category.UNISEX.value)))
    # one of ProductType's values
    product_type: Mapped[int] = mapped_column(SmallInteger, index=True, server_default=text(str(ProductType.SHOE.value)))
    on_sale: Mapped[bool] = mapped_column(Boolean, index=True, server_default=false())
    # only set while on_sale is true, and always below price (see ck_products_sale_price_valid)
    sale_price: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))

    variants: Mapped[list["ProductVariant"]] = relationship(back_populates="product", cascade="all, delete-orphan")

    @hybrid_property
    def current_price(self) -> Decimal:
        """What a customer pays right now: the sale price while on sale, otherwise the normal price."""
        return self.sale_price if self.on_sale and self.sale_price is not None else self.price

    @current_price.inplace.expression
    @classmethod
    def _current_price_expression(cls):
        # the same rule in SQL, so filters and sorting use the price customers actually pay
        return case((cls.on_sale, cls.sale_price), else_=cls.price)


class ProductVariant(Base):
    """Stock is tracked per size and color, not per product."""

    __tablename__ = "product_variants"
    __table_args__ = (UniqueConstraint("product_id", "size", "color"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"))
    size: Mapped[str] = mapped_column(String(10))
    color: Mapped[str] = mapped_column(String(50))
    stock: Mapped[int] = mapped_column(default=0)

    product: Mapped[Product] = relationship(back_populates="variants")


class Role(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    # stored as plain VARCHAR ("admin" / "user") so adding a role later needs no DB enum migration
    role: Mapped[Role] = mapped_column(
        Enum(Role, native_enum=False, length=20, values_callable=lambda e: [r.value for r in e]),
        default=Role.USER,
        server_default=Role.USER.value,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    orders: Mapped[list["Order"]] = relationship(back_populates="user")


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    # one of OrderStatus's values, stored as plain text
    status: Mapped[str] = mapped_column(String(20), default=OrderStatus.PENDING.value)
    total: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped[User] = relationship(back_populates="orders")
    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"))
    variant_id: Mapped[int] = mapped_column(ForeignKey("product_variants.id"))
    quantity: Mapped[int]
    # price at purchase time, so later price changes don't alter old orders
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2))

    order: Mapped[Order] = relationship(back_populates="items")
    variant: Mapped[ProductVariant] = relationship()
