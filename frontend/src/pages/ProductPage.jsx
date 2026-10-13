import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useParams } from "react-router-dom";
import PageLayout from "../components/PageLayout/PageLayout";
import ProductImage from "../components/ProductImage/ProductImage";
import { api } from "../api/client";
import { MAX_PER_ITEM, useCart } from "../context/CartContext";
import { formatPrice, sortSizes } from "../utils/format";
import { pillInput, primaryButton } from "../theme/styles";

const optionButton = (selected) => ({
  px: 2.5,
  minWidth: 56,
  ...(selected && { bgcolor: "black", color: "white", "&:hover": { bgcolor: "black" } }),
  "&.Mui-disabled": { color: "rgb(180,180,180)", borderColor: "rgb(220,220,220)", textDecoration: "line-through" },
});

function ProductPage() {
  const { id } = useParams();
  const cart = useCart();
  // both remember which id they belong to, so moving to another product shows a spinner, not the old shoe
  const [loaded, setLoaded] = useState({ id: null, product: null, error: "" });
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .getProduct(id)
      .then((p) => {
        if (cancelled) return;
        setLoaded({ id, product: p, error: "" });
        // start on a color that still has stock, if there is one
        const firstInStock = p.variants.find((v) => v.stock > 0) || p.variants[0];
        setColor(firstInStock?.color || "");
        setSize("");
      })
      .catch((err) => {
        if (!cancelled) setLoaded({ id, product: null, error: err.status === 404 ? "We couldn't find that shoe." : err.message });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const product = loaded.id === id ? loaded.product : null;
  const error = loaded.id === id ? loaded.error : "";

  if (error) {
    return (
      <PageLayout>
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        <Button component={Link} to="/shop">Back to shop</Button>
      </PageLayout>
    );
  }
  if (!product) {
    return (
      <PageLayout>
        <CircularProgress color="inherit"></CircularProgress>
      </PageLayout>
    );
  }

  const colors = [...new Set(product.variants.map((v) => v.color))];
  const forColor = product.variants.filter((v) => v.color === color);
  const sizes = sortSizes(forColor.map((v) => v.size));
  const variant = forColor.find((v) => v.size === size);
  const inBag = cart.items.find((i) => i.variantId === variant?.id)?.quantity || 0;
  const canAdd = variant ? Math.min(variant.stock, MAX_PER_ITEM) - inBag : 0;

  function addToBag() {
    cart.addItem(
      {
        variantId: variant.id,
        productId: product.id,
        name: product.name,
        brand: product.brand,
        imageUrl: product.image_url,
        price: product.price,
        size: variant.size,
        color: variant.color,
        maxStock: variant.stock,
      },
      quantity,
    );
    setQuantity(1);
    setAdded(true);
  }

  return (
    <PageLayout>
      <Box sx={{ display: "grid", gap: { xs: 4, md: 8 }, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
        <ProductImage product={product} height={{ xs: 320, md: 480 }}></ProductImage>
        <Box>
          <Typography sx={{ color: "rgb(110,110,110)" }}>{product.brand}</Typography>
          <Typography component="h1" sx={{ fontFamily: "Brzo-Basic, sans-serif", fontWeight: 800, fontSize: { xs: 34, md: 44 }, lineHeight: 1.1 }}>
            {product.name}
          </Typography>
          <Typography sx={{ fontSize: 22, mt: 1, mb: 3 }}>{formatPrice(product.price)}</Typography>
          {product.description && <Typography sx={{ mb: 3 }}>{product.description}</Typography>}

          {product.variants.length === 0 ? (
            <Alert severity="info">This shoe isn't available to order yet.</Alert>
          ) : (
            <>
              {colors.length > 1 && (
                <>
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>Color</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                    {colors.map((c) => (
                      <Button
                        key={c}
                        sx={optionButton(c === color)}
                        onClick={() => {
                          setColor(c);
                          setSize("");
                          setQuantity(1);
                          setAdded(false);
                        }}
                      >
                        {c}
                      </Button>
                    ))}
                  </Box>
                </>
              )}

              <Typography sx={{ fontWeight: 700, mb: 1 }}>Size{colors.length === 1 && color !== "Default" ? ` · ${color}` : ""}</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                {sizes.map((s) => {
                  const v = forColor.find((x) => x.size === s);
                  return (
                    <Button
                      key={s}
                      disabled={v.stock === 0}
                      sx={optionButton(s === size)}
                      onClick={() => {
                        setSize(s);
                        setQuantity(1);
                        setAdded(false);
                      }}
                    >
                      {s}
                    </Button>
                  );
                })}
              </Box>

              {variant && variant.stock > 0 && variant.stock <= 3 && (
                <Typography sx={{ color: "rgb(200,40,40)", mb: 2 }}>Only {variant.stock} left in this size</Typography>
              )}

              <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                <TextField
                  select
                  size="small"
                  label="Qty"
                  value={quantity}
                  disabled={canAdd <= 0}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  sx={{ ...pillInput, width: 96 }}
                >
                  {Array.from({ length: Math.max(canAdd, 1) }, (_, i) => i + 1).map((n) => (
                    <MenuItem key={n} value={n}>
                      {n}
                    </MenuItem>
                  ))}
                </TextField>
                <Button onClick={addToBag} disabled={!variant || canAdd <= 0} sx={{ ...primaryButton, py: 1.2, flex: 1, minWidth: 200 }}>
                  {!variant ? "Choose a size" : canAdd <= 0 ? "All available pairs are in your bag" : "Add to bag"}
                </Button>
              </Box>

              {added && (
                <Alert
                  severity="success"
                  sx={{ mt: 3 }}
                  action={
                    <Button component={Link} to="/cart" sx={{ px: 2, py: 0.5 }}>
                      View bag
                    </Button>
                  }
                >
                  Added to your bag
                </Alert>
              )}
            </>
          )}
        </Box>
      </Box>
    </PageLayout>
  );
}
export default ProductPage;
