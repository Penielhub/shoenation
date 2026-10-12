"""Run from backend/:  python -m app.seed"""
from .database import Base, SessionLocal, engine
from .models import Product, ProductVariant

PRODUCTS = [
    ("Air Jordan 1", "Nike", 150),
    ("Yeezy Boost 350", "Adidas", 220),
    ("RS-X", "Puma", 110),
    ("Classic Leather", "Reebok", 75),
    ("990v5", "New Balance", 175),
]
SIZES = ["8", "9", "10", "11"]


def seed():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        if db.query(Product).first():
            print("Products already exist, skipping seed.")
            return
        for name, brand, price in PRODUCTS:
            db.add(Product(
                name=name, brand=brand, price=price,
                variants=[ProductVariant(size=s, color="Default", stock=10) for s in SIZES],
            ))
        db.commit()
        print(f"Seeded {len(PRODUCTS)} products.")


if __name__ == "__main__":
    seed()
