# Shoenation API docs

Browse every backend endpoint in Swagger UI, without installing or running anything:

**👉 [Open the Swagger UI](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/Penielhub/shoenation/api-docs/docs/api/openapi.json)**

| File | What it is |
|---|---|
| [openapi.json](openapi.json) | The API description (endpoints, request and response shapes) that Swagger UI reads |
| [index.html](index.html) | The same Swagger UI as a single page. Download it and double-click to open it offline. |

## Trying requests ("Try it out")

The docs can be read by anyone, but requests go to **your own** backend at `http://localhost:8000`:

1. Start the backend (see the setup steps in `backend/`): `uvicorn app.main:app --reload`
2. In Swagger UI, click **Authorize**, enter your email as `username` and your password.
3. Open an endpoint, click **Try it out**, then **Execute**.

While the backend runs you also get the live version at <http://localhost:8000/docs>.

## Updating the docs

These files don't update themselves. After adding or changing an endpoint, run this from `backend/` and commit the result:

```
python -m app.export_docs
```
