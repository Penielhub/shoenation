import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout/PageLayout";
import ProductImage from "../components/ProductImage/ProductImage";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { MAX_PER_ITEM, useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import { pillInput, primaryButton } from "../theme/styles";

function CheckoutError({ error }) {
  if (!error) return null;
  return (
    <Alert severity="warning" sx={{ mb: 3 }}>
      {error.title}
      {error.lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </Alert>
  );
}

function CartPage() {
  const cart = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function checkout() {
    if (!user) {
      navigate("/login?next=/cart");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const order = await api.placeOrder(cart.items.map((i) => ({ variant_id: i.variantId, quantity: i.quantity })));
      cart.clear();
      navigate(`/orders?placed=${order.id}`);
    } catch (err) {
      const shortages = err.status === 409 ? err.detail?.items : null;
      if (shortages) {
        const lines = shortages.map((s) => {
          const item = cart.items.find((i) => i.variantId === s.variant_id);
          const label = item ? `${item.name} (size ${item.size})` : "An item";
          return s.available === 0 ? `${label} sold out and was removed.` : `${label}: only ${s.available} left, quantity updated.`;
        });
        cart.applyStock(shortages);
        setError({ title: "Some pairs sold out while you were shopping. Your bag has been updated:", lines });
      } else if (err.status === 401) {
        navigate("/login?next=/cart");
      } else {
        setError({ title: err.message, lines: [] });
      }
    } finally {
      setBusy(false);
    }
  }

  if (cart.items.length === 0) {
    return (
      <PageLayout title="Your bag">
        <CheckoutError error={error}></CheckoutError>
        <Typography sx={{ mb: 3 }}>Your bag is empty.</Typography>
        <Button component={RouterLink} to="/shop" sx={primaryButton}>
          Start shopping
        </Button>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Your bag">
      <Box sx={{ display: "grid", gap: { xs: 4, md: 8 }, gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, alignItems: "start" }}>
        <Box>
          <CheckoutError error={error}></CheckoutError>
          {cart.items.map((item, index) => (
            <Box key={item.variantId}>
              {index > 0 && <Divider sx={{ my: 3 }}></Divider>}
              <Box sx={{ display: "flex", gap: 3 }}>
                <Box sx={{ width: { xs: 96, sm: 140 }, flexShrink: 0 }}>
                  <ProductImage product={{ name: item.name, brand: item.brand, image_url: item.imageUrl }} height={{ xs: 96, sm: 140 }}></ProductImage>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Link component={RouterLink} to={`/products/${item.productId}`} sx={{ color: "black", fontWeight: 700 }} underline="hover">
                    {item.name}
                  </Link>
                  <Typography sx={{ fontSize: 14, color: "rgb(110,110,110)" }}>
                    {item.brand} · Size {item.size}
                    {item.color !== "Default" && ` · ${item.color}`}
                  </Typography>
                  <Typography sx={{ mt: 0.5 }}>{formatPrice(item.price)}</Typography>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}>
                    <TextField
                      select
                      size="small"
                      label="Qty"
                      value={item.quantity}
                      onChange={(e) => cart.setQuantity(item.variantId, Number(e.target.value))}
                      sx={{ ...pillInput, width: 96 }}
                    >
                      {Array.from({ length: Math.min(item.maxStock, MAX_PER_ITEM) }, (_, i) => i + 1).map((n) => (
                        <MenuItem key={n} value={n}>
                          {n}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Link component="button" type="button" onClick={() => cart.removeItem(item.variantId)} sx={{ color: "black" }}>
                      Remove
                    </Link>
                  </Box>
                </Box>
                <Typography sx={{ fontWeight: 700, display: { xs: "none", sm: "block" } }}>
                  {formatPrice(Number(item.price) * item.quantity)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ border: "0.8px black solid", borderRadius: 4, p: 3 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 20, mb: 2 }}>Summary</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>
              {cart.count} {cart.count === 1 ? "pair" : "pairs"}
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>{formatPrice(cart.subtotal)}</Typography>
          </Box>
          <Typography sx={{ fontSize: 13, color: "rgb(110,110,110)", mb: 3 }}>
            Prices and stock are confirmed when you place the order.
          </Typography>
          <Button fullWidth onClick={checkout} disabled={busy} sx={{ ...primaryButton, py: 1.5 }}>
            {busy ? "Placing order…" : user ? "Place order" : "Sign in to check out"}
          </Button>
        </Box>
      </Box>
    </PageLayout>
  );
}
export default CartPage;
