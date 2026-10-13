import { RouterProvider } from "react-router-dom";
import router from "./app/router.jsx";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router}></RouterProvider>
      </CartProvider>
    </AuthProvider>
  );
}
export default App;
