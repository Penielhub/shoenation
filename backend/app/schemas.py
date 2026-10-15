from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, computed_field, field_validator, model_validator

from .models import Category, OrderStatus, ProductType, Role


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    role: Role
    created_at: datetime


class RoleUpdate(BaseModel):
    role: Role


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class VariantIn(BaseModel):
    size: str = Field(max_length=10)
    color: str = Field(max_length=50)
    stock: int = Field(default=0, ge=0)


class VariantUpdate(BaseModel):
    """Partial update: only the fields sent are changed. `stock` is the new absolute count."""

    size: str | None = Field(default=None, max_length=10)
    color: str | None = Field(default=None, max_length=50)
    stock: int | None = Field(default=None, ge=0)

    @field_validator("size", "color", "stock")
    @classmethod
    def not_null(cls, v):
        # omitting a field is fine, explicitly sending null is not
        if v is None:
            raise ValueError("cannot be null")
        return v


class VariantOut(VariantIn):
    model_config = ConfigDict(from_attributes=True)

    id: int


def sale_price_problem(price: Decimal, on_sale: bool, sale_price: Decimal | None) -> str | None:
    """The sale rules, shared by create and update. Mirrors the ck_products_sale_price_valid constraint."""
    if on_sale and sale_price is None:
        return "sale_price is required when on_sale is true"
    if not on_sale and sale_price is not None:
        return "sale_price can only be set when on_sale is true"
    if on_sale and sale_price >= price:
        return f"sale_price ({sale_price}) must be lower than price ({price})"
    return None


CATEGORY_HELP = "1 = men, 2 = women, 3 = kids, 4 = unisex"
PRODUCT_TYPE_HELP = "1 = shoe, 2 = merch"


class ProductCreate(BaseModel):
    name: str = Field(max_length=200)
    brand: str = Field(max_length=100)
    description: str | None = None
    price: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    image_url: str | None = Field(default=None, max_length=500)
    category: Category = Field(description=CATEGORY_HELP)
    product_type: ProductType = Field(default=ProductType.SHOE, description=PRODUCT_TYPE_HELP)
    on_sale: bool = False
    sale_price: Decimal | None = Field(default=None, gt=0, max_digits=10, decimal_places=2)
    variants: list[VariantIn] = []

    @model_validator(mode="after")
    def check_sale(self):
        problem = sale_price_problem(self.price, self.on_sale, self.sale_price)
        if problem:
            raise ValueError(problem)
        return self

    @field_validator("variants")
    @classmethod
    def unique_variants(cls, variants):
        keys = [(v.size, v.color) for v in variants]
        if len(keys) != len(set(keys)):
            raise ValueError("each size/color combination can only appear once")
        return variants


class ProductUpdate(BaseModel):
    """Partial update of product details. Variants are managed through their own endpoints."""

    name: str | None = Field(default=None, max_length=200)
    brand: str | None = Field(default=None, max_length=100)
    description: str | None = None
    price: Decimal | None = Field(default=None, gt=0, max_digits=10, decimal_places=2)
    image_url: str | None = Field(default=None, max_length=500)
    category: Category | None = Field(default=None, description=CATEGORY_HELP)
    product_type: ProductType | None = Field(default=None, description=PRODUCT_TYPE_HELP)
    on_sale: bool | None = Field(default=None, description="Setting this to false also clears sale_price")
    sale_price: Decimal | None = Field(default=None, gt=0, max_digits=10, decimal_places=2)

    @field_validator("name", "brand", "price", "category", "product_type", "on_sale")
    @classmethod
    def not_null(cls, v):
        if v is None:
            raise ValueError("cannot be null")
        return v


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    brand: str
    description: str | None
    price: Decimal
    image_url: str | None
    category: Category
    product_type: ProductType
    on_sale: bool
    sale_price: Decimal | None
    current_price: Decimal = Field(description="What a customer pays now: sale_price while on sale, else price")
    variants: list[VariantOut]

    @computed_field
    @property
    def discount_percent(self) -> int | None:
        """Rounded percentage off, for a "-20%" badge. None when not on sale."""
        if not self.on_sale or self.sale_price is None:
            return None
        return round((self.price - self.sale_price) / self.price * 100)


class ProductPage(BaseModel):
    items: list[ProductOut]
    total: int
    limit: int
    offset: int


class OrderItemIn(BaseModel):
    variant_id: int
    quantity: int = Field(ge=1, le=20)


class OrderCreate(BaseModel):
    """Prices aren't sent: the server looks them up, so a client can't choose its own price."""

    items: list[OrderItemIn] = Field(min_length=1, max_length=50)


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class OrderProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    brand: str
    image_url: str | None


class OrderVariantOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    size: str
    color: str
    product: OrderProductOut


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    quantity: int
    unit_price: Decimal
    variant: OrderVariantOut


class OrderUserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: OrderStatus
    total: Decimal
    created_at: datetime
    user: OrderUserOut
    items: list[OrderItemOut]


class OrderPage(BaseModel):
    items: list[OrderOut]
    total: int
    limit: int
    offset: int
