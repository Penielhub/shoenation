import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useSearchParams } from "react-router-dom";
import PageLayout from "../components/PageLayout/PageLayout";
import ProductImage from "../components/ProductImage/ProductImage";
import { api } from "../api/client";
import { formatPrice, sortSizes } from "../utils/format";
import { pillInput } from "../theme/styles";

const PAGE_SIZE = 12;
const SIZES = ["6", "7", "8", "9", "10", "11", "12", "13"];
const SORTS = [
  { value: "", label: "Featured" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "name", label: "Name" },
];

function ProductCard({ product }) {
  const sizes = sortSizes(new Set(product.variants.filter((v) => v.stock > 0).map((v) => v.size)));
  return (
    <Box
      component={Link}
      to={`/products/${product.id}`}
      sx={{ color: "black", textDecoration: "none", display: "block", "&:hover img, &:hover > div:first-of-type": { opacity: 0.85 } }}
    >
      <ProductImage product={product}></ProductImage>
      <Typography sx={{ mt: 1.5, fontSize: 13, color: "rgb(110,110,110)" }}>{product.brand}</Typography>
      <Typography sx={{ fontWeight: 700 }}>{product.name}</Typography>
      <Typography>{formatPrice(product.price)}</Typography>
      <Typography sx={{ fontSize: 13, color: sizes.length ? "rgb(110,110,110)" : "rgb(200,40,40)" }}>
        {sizes.length ? `Sizes ${sizes.join(", ")}` : "Sold out"}
      </Typography>
    </Box>
  );
}

function ShopPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const size = params.get("size") || "";
  const sort = params.get("sort") || "";
  const inStock = params.get("in_stock") === "true";

  const [search, setSearch] = useState(q);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const filters = { q, size, sort, in_stock: inStock || undefined, limit: PAGE_SIZE };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    api
      .listProducts({ ...filters, offset: 0 })
      .then((page) => {
        if (cancelled) return;
        setProducts(page.items);
        setTotal(page.total);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // filters is rebuilt every render from these four values, so they're the real dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, size, sort, inStock]);

  function updateFilter(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  async function loadMore() {
    setLoadingMore(true);
    try {
      const page = await api.listProducts({ ...filters, offset: products.length });
      setProducts((current) => [...current, ...page.items]);
      setTotal(page.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <PageLayout title="Shop all">
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", mb: 4 }}>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            updateFilter("q", search.trim());
          }}
          sx={{ flex: { xs: "1 1 100%", md: "1 1 280px" } }}
        >
          <TextField
            fullWidth
            size="small"
            label="Search shoes or brands"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={() => search.trim() !== q && updateFilter("q", search.trim())}
            sx={pillInput}
          ></TextField>
        </Box>
        <TextField select size="small" label="Size" value={size} onChange={(e) => updateFilter("size", e.target.value)} sx={{ ...pillInput, minWidth: 120 }}>
          <MenuItem value="">Any size</MenuItem>
          {SIZES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <TextField select size="small" label="Sort" value={sort} onChange={(e) => updateFilter("sort", e.target.value)} sx={{ ...pillInput, minWidth: 190 }}>
          {SORTS.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          control={
            <Checkbox
              checked={inStock}
              onChange={(e) => updateFilter("in_stock", e.target.checked ? "true" : "")}
              sx={{ "&.Mui-checked": { color: "black" } }}
            ></Checkbox>
          }
          label="In stock only"
        ></FormControlLabel>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <CircularProgress color="inherit"></CircularProgress>
      ) : products.length === 0 && !error ? (
        <Typography>No shoes match those filters.</Typography>
      ) : (
        <>
          <Typography sx={{ mb: 2, color: "rgb(110,110,110)" }}>
            {total} {total === 1 ? "style" : "styles"}
          </Typography>
          <Box sx={{ display: "grid", gap: 4, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" } }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product}></ProductCard>
            ))}
          </Box>
          {products.length < total && (
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <Button onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "Loading…" : "Load more"}
              </Button>
            </Box>
          )}
        </>
      )}
    </PageLayout>
  );
}
export default ShopPage;
