from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import auth, products, users

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

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(products.router)
