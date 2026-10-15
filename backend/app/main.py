from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import auth, orders, products, users

# tables are created and changed by Alembic migrations, not here: run `alembic upgrade head`
app = FastAPI(
    title="Shoenation API",
    version="1.0.0",
    description=(
        "Backend for the Shoenation sneaker shop: accounts with admin/user roles, "
        "the product catalog, and orders.\n\n"
        "**Signing in:** click **Authorize**, enter your email as `username` and your password. "
        "Admin-only endpoints return 403 for regular users."
    ),
)

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
app.include_router(orders.router)
