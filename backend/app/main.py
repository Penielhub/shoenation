from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models
from .database import Base, engine, get_db

# creates any missing tables on startup. It never changes existing tables, so a new column needs an ALTER TABLE.
Base.metadata.create_all(bind=engine)

app = FastAPI()

# lets frontend talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()
