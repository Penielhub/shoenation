# Shoenation backend

FastAPI + PostgreSQL. Once it's running, the interactive API docs (Swagger UI) are at **http://localhost:8000/docs**.

> Only want to **read** the API? You don't need any of this:
> [open the API docs](../docs/api/README.md) in your browser.

## What you need

- **Python 3.10 or newer**: check with `python --version`
- **PostgreSQL**: check with `psql --version`. If you don't have it, install it from <https://www.postgresql.org/download/> and remember the password you set for the `postgres` user.

## First-time setup

Run these from the `backend/` folder.

**1. Create the database** (only once). Use whichever you prefer:

```
psql -U postgres -c "CREATE DATABASE shoenation;"
```

On Windows, if `psql` is "not recognized", use its full path (change `18` to your PostgreSQL version):

```
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE shoenation;"
```

or, in pgAdmin: right-click **Databases** → **Create** → **Database…** → name it `shoenation`.

**2. Create a virtual environment and install the packages**

Windows (PowerShell):
```
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Mac / Linux:
```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**3. Create your settings file**

Windows: `copy .env.example .env`. Mac/Linux: `cp .env.example .env`.

Then open `.env` and fill in:

| Setting | What to put |
|---|---|
| `DATABASE_URL` | Replace `YOUR_PASSWORD` with your PostgreSQL password |
| `SECRET_KEY` | A long random value. Generate one with `python -c "import secrets; print(secrets.token_urlsafe(64))"` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | The admin account you want to sign in with |

`.env` is never committed, so your passwords stay on your computer. Never share it.

**4. Create the tables and sample data**

```
alembic upgrade head
python -m app.seed
```

You should see `Seeded 5 products.` and `Created admin …`.

## Running it (every time)

```
venv\Scripts\activate          # Mac/Linux: source venv/bin/activate
uvicorn app.main:app --reload
```

Then open **http://localhost:8000/docs**. Stop the server with `Ctrl+C`.

## Using Swagger UI

1. Click **Authorize** (top right). Enter your `ADMIN_EMAIL` as **username** and your `ADMIN_PASSWORD` as **password**, then click Authorize and Close.
2. Open any endpoint → **Try it out** → **Execute**.
3. Want to test as a normal shopper? Use `POST /auth/register` to make an account, then **Logout** and **Authorize** again with it.

Endpoints with a 🔒 need you to be signed in. Admin-only ones (adding products, changing order status, listing users) return **403** for normal users.

## After pulling new code

```
pip install -r requirements.txt
alembic upgrade head
```

The first installs any new packages; the second applies any database changes.

## Common problems

| Problem | Fix |
|---|---|
| `DATABASE_URL is not set` / `SECRET_KEY is not set` | You're missing `.env` (step 3), or you're not in the `backend/` folder |
| `password authentication failed` | The password in `DATABASE_URL` is wrong |
| `database "shoenation" does not exist` | Do step 1 |
| `relation "products" does not exist` | Run `alembic upgrade head` |
| `Address already in use` / port 8000 busy | Another server is running. Stop it, or use `uvicorn app.main:app --reload --port 8001` |
| `psql` "not recognized" | Use the full path shown in step 1, or create the database in pgAdmin |
| `alembic` or `uvicorn` "not recognized" | Activate the virtual environment first (`venv\Scripts\activate`) |

## Updating the shared API docs

After adding or changing an endpoint, regenerate the public docs in `docs/api/` and commit them:

```
python -m app.export_docs
```
