import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import logo from "../../assets/logo.svg";
import Box from "@mui/material/Box";
import { Height } from "@mui/icons-material";
import { Link } from "react-router-dom";
import userIcon from "../../assets/user.svg";
import shoppingBag from "../../assets/shoppingbag.svg";
import SvgIcon from "@mui/material/SvgIcon";
import Badge from "@mui/material/Badge";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
// onLight: the logo is white for the home page's hero photo, so it's turned black on white pages
function Navbar({ onLight = false }) {
  const { user } = useAuth();
  const { count } = useCart();
  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "transparent",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          px: 3,
          py: 3,
          width: "100%",
          display: "flex",
          gap: 6,
        }}
      >
        <Box
          component={Link}
          to="/"
          aria-label="Shoenation home"
          sx={{ display: "flex" }}
        >
        <Box
          component="img"
          src={logo}
          alt="Shoenation"
          sx={{
            filter: onLight ? "invert(1)" : "none",
            width: 40,
            height: "auto",
          }}
        ></Box>
        </Box>
        <nav style={{ display: "flex", gap: "10px" }}>
          <Button component={Link} to="/shop">
            Shop all
          </Button>
          <Button component={Link} to="/underconstruction">
            SALE
          </Button>
          <Button component={Link} to="/underconstruction">
            Men
          </Button>
          <Button component={Link} to="/underconstruction">
            Women
          </Button>
          <Button component={Link} to="/underconstruction">
            Kids
          </Button>
        </nav>
        <Box sx={{ display: "flex", gap: "10px", ml: "auto" }}>
          <Button sx={{ px: 5 }} component={Link} to="/cart" aria-label={`Bag, ${count} items`}>
            <Badge
              badgeContent={count}
              max={99}
              sx={{ "& .MuiBadge-badge": { bgcolor: "rgb(255, 219, 48)", color: "black", fontWeight: 700 } }}
            >
              <Box component="img" src={shoppingBag} alt="" sx={{ width: 20 }}></Box>
            </Badge>
          </Button>
          <Button sx={{ px: 5 }} component={Link} to={user ? "/orders" : "/login"} aria-label={user ? "Your orders" : "Sign in"}>
            <Box component="img" src={userIcon} alt="" sx={{ width: 18 }}></Box>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;
