import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useSearchParams } from "react-router-dom";
import PageLayout from "../components/PageLayout/PageLayout";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatPrice } from "../utils/format";
import { primaryButton } from "../theme/styles";

const PAGE_SIZE = 10;

const STATUS_COLORS = {
  pending: "rgb(255,219,48)",
  paid: "rgb(100,211,255)",
  shipped: "rgb(190,160,255)",
  delivered: "rgb(130,220,140)",
  cancelled: "rgb(225,225,225)",
};

function OrderCard({ order, onCancel, cancelling }) {
  return (
    <Box sx={{ border: "0.8px black solid", borderRadius: 4, p: { xs: 2.5, md: 3 } }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center", mb: 2 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 18 }}>Order #{order.id}</Typography>
        <Chip
          label={order.status}
          size="small"
          sx={{ bgcolor: STATUS_COLORS[order.status], textTransform: "capitalize", fontWeight: 700 }}
        ></Chip>
        <Typography sx={{ ml: { sm: "auto" }, width: { xs: "100%", sm: "auto" }, color: "rgb(110,110,110)", fontSize: 14 }}>
          {formatDate(order.created_at)}
        </Typography>
      </Box>

      {order.items.map((item) => (
        <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", gap: 2, py: 0.75 }}>
          <Typography>
            <Box component={Link} to={`/products/${item.variant.product.id}`} sx={{ color: "black", fontWeight: 700 }}>
              {item.variant.product.name}
            </Box>{" "}
            <Box component="span" sx={{ color: "rgb(110,110,110)", fontSize: 14 }}>
              Size {item.variant.size}
              {item.variant.color !== "Default" && ` · ${item.variant.color}`} · {item.quantity} × {formatPrice(item.unit_price)}
            </Box>
          </Typography>
          <Typography sx={{ whiteSpace: "nowrap" }}>{formatPrice(Number(item.unit_price) * item.quantity)}</Typography>
        </Box>
      ))}

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2, pt: 2, borderTop: "0.8px rgb(220,220,220) solid" }}>
        <Typography sx={{ fontWeight: 800 }}>Total {formatPrice(order.total)}</Typography>
        {order.status === "pending" && (
          <Button sx={{ ml: "auto", px: 3 }} disabled={cancelling} onClick={() => onCancel(order)}>
            {cancelling ? "Cancelling…" : "Cancel order"}
          </Button>
        )}
      </Box>
    </Box>
  );
}

function OrdersPage() {
  const { user, logout } = useAuth();
  const [params] = useSearchParams();
  const placedId = Number(params.get("placed")) || null;

  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .listOrders({ limit: PAGE_SIZE, offset: 0 })
      .then((page) => {
        if (cancelled) return;
        setOrders(page.items);
        setTotal(page.total);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const page = await api.listOrders({ limit: PAGE_SIZE, offset: orders.length });
      setOrders((current) => [...current, ...page.items]);
      setTotal(page.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  async function cancelOrder(order) {
    if (!window.confirm(`Cancel order #${order.id}? The pairs go back on sale.`)) return;
    setCancellingId(order.id);
    setError("");
    try {
      const updated = await api.cancelOrder(order.id);
      setOrders((current) => current.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <PageLayout title="Your orders">
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, mb: 4 }}>
        <Typography>
          Signed in as <b>{user.email}</b>
          {user.role === "admin" && " (admin)"}
        </Typography>
        <Button onClick={logout} sx={{ ml: { sm: "auto" } }}>
          Log out
        </Button>
      </Box>

      {placedId && <Alert severity="success" sx={{ mb: 3 }}>Order #{placedId} placed! We'll update its status here.</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <CircularProgress color="inherit"></CircularProgress>
      ) : orders.length === 0 && !error ? (
        <>
          <Typography sx={{ mb: 3 }}>You haven't placed any orders yet.</Typography>
          <Button component={Link} to="/shop" sx={primaryButton}>
            Start shopping
          </Button>
        </>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onCancel={cancelOrder} cancelling={cancellingId === order.id}></OrderCard>
          ))}
          {orders.length < total && (
            <Box sx={{ textAlign: "center" }}>
              <Button onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "Loading…" : "Load more"}
              </Button>
            </Box>
          )}
        </Box>
      )}
    </PageLayout>
  );
}
export default OrdersPage;
