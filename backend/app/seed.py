"""Run from backend/: first `alembic upgrade head`, then `python -m app.seed`"""
import os

from .database import SessionLocal
from .models import Gender, Product, ProductType, ProductVariant, Role, User
from .security import hash_password

SHOE_SIZES = ["8", "9", "10", "11"]
KIDS_SIZES = ["1", "2", "3", "4"]
MERCH_SIZES = ["S", "M", "L", "XL"]

# name, brand, price, gender, is_kids, type, sizes, sale price (None = not on sale)
PRODUCTS = [
    ("Air Jordan 1", "Nike", 150, Gender.MALE, False, ProductType.SHOE, SHOE_SIZES, None),
    ("Yeezy Boost 350", "Adidas", 220, Gender.UNISEX, False, ProductType.SHOE, SHOE_SIZES, None),
    ("RS-X", "Puma", 110, Gender.FEMALE, False, ProductType.SHOE, SHOE_SIZES, None),
    ("Classic Leather", "Reebok", 75, Gender.FEMALE, False, ProductType.SHOE, SHOE_SIZES, 60),
    ("990v5", "New Balance", 175, Gender.MALE, False, ProductType.SHOE, SHOE_SIZES, None),
    ("Air Force 1 Kids", "Nike", 70, Gender.UNISEX, True, ProductType.SHOE, KIDS_SIZES, None),
    ("Shoenation Logo Tee", "Shoenation", 35, Gender.UNISEX, False, ProductType.MERCH, MERCH_SIZES, 28),
]


def seed_products(db):
    if db.query(Product).first():
        print("Products already exist, skipping product seed.")
        return
    for name, brand, price, gender, is_kids, product_type, sizes, sale_price in PRODUCTS:
        db.add(Product(
            name=name, brand=brand, price=price, gender=gender, is_kids=is_kids, product_type=product_type,
            on_sale=sale_price is not None, sale_price=sale_price,
            variants=[ProductVariant(size=s, color="Default", stock=10) for s in sizes],
        ))
    db.commit()
    print(f"Seeded {len(PRODUCTS)} products.")


def seed_admin(db):
    """Admins can't sign up through the API, so the first one is created here from .env."""
    email, password = os.getenv("ADMIN_EMAIL"), os.getenv("ADMIN_PASSWORD")
    if not email or not password:
        print("ADMIN_EMAIL / ADMIN_PASSWORD not set, skipping admin seed.")
        return
    email = email.lower()
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        db.add(User(email=email, hashed_password=hash_password(password), role=Role.ADMIN))
        print(f"Created admin {email}.")
    elif user.role != Role.ADMIN:
        user.role = Role.ADMIN
        print(f"Promoted existing user {email} to admin.")
    else:
        print(f"Admin {email} already exists, skipping admin seed.")
    db.commit()


def seed():
    with SessionLocal() as db:
        seed_products(db)
        seed_admin(db)


if __name__ == "__main__":
    seed()
