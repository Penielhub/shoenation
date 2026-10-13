"""Run from backend/: first `alembic upgrade head`, then `python -m app.seed`"""
import os

from .database import SessionLocal
from .models import Product, ProductVariant, Role, User
from .security import hash_password

PRODUCTS = [
    ("Air Jordan 1", "Nike", 150),
    ("Yeezy Boost 350", "Adidas", 220),
    ("RS-X", "Puma", 110),
    ("Classic Leather", "Reebok", 75),
    ("990v5", "New Balance", 175),
]
SIZES = ["8", "9", "10", "11"]


def seed_products(db):
    if db.query(Product).first():
        print("Products already exist, skipping product seed.")
        return
    for name, brand, price in PRODUCTS:
        db.add(Product(
            name=name, brand=brand, price=price,
            variants=[ProductVariant(size=s, color="Default", stock=10) for s in SIZES],
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
