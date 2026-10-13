import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import UnderConstruction from "../pages/UnderConstruction";
import LoginPage from "../pages/LoginPage";
import ShopPage from "../pages/ShopPage";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import OrdersPage from "../pages/OrdersPage";
import RequireAuth from "../components/RequireAuth/RequireAuth";
const router = createBrowserRouter(
  [
    { path: "/", element: <HomePage /> },
    { path: "/underconstruction", element: <UnderConstruction /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/shop", element: <ShopPage /> },
    { path: "/products/:id", element: <ProductPage /> },
    { path: "/cart", element: <CartPage /> },
    { path: "/orders", element: <RequireAuth><OrdersPage /></RequireAuth> },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, "") },
);

export default router;
