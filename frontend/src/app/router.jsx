import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import UnderConstruction from "../pages/UnderConstruction";
import LoginPage from "../pages/LoginPage";
import ProductCarousel from "../components/ProductCarousel/ProductCarousel";
import {ProductPage} from "../pages/ProductPage";
import ProductEntries from "../components/ProductEntries/ProductEntries";
const router = createBrowserRouter(
  [
    { path: "/", element: <HomePage /> },
    { path: "/underconstruction", element: <UnderConstruction /> },
    {path: "/login", element:<LoginPage/>},
    {path: "/test",element:<ProductCarousel/>},
    {path: "/products",element:<ProductPage/>},
    {path:"/productentry",element:<ProductEntries/>}
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, "") },
);

export default router;
