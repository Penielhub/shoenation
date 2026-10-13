import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import UnderConstruction from "../pages/UnderConstruction";
import LoginPage from "../pages/LoginPage";
const router = createBrowserRouter(
  [
    { path: "/", element: <HomePage /> },
    { path: "/underconstruction", element: <UnderConstruction /> },
    {path: "/login", element:<LoginPage/>}
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, "") },
);

export default router;
