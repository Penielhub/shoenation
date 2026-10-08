import { Typography } from "@mui/material";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UnderConstruction from "./pages/UnderConstruction";
import { RouterProvider } from "react-router-dom";
import router from "./app/router.jsx";
function App() {
  return (
    <RouterProvider router={router}></RouterProvider>
  );
}
export default App;
