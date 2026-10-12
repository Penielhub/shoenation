from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from .models import Role


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


class ProductCreate(BaseModel):
    name: str = Field(max_length=200)
    brand: str = Field(max_length=100)
    description: str | None = None
    price: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    image_url: str | None = Field(default=None, max_length=500)
    variants: list[VariantIn] = []

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

    @field_validator("name", "brand", "price")
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
    variants: list[VariantOut]


class ProductPage(BaseModel):
    items: list[ProductOut]
    total: int
    limit: int
    offset: int
