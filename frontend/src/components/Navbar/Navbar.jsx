import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import logo from "../../assets/logo.svg";
import Box from "@mui/material/Box";
import { Height } from "@mui/icons-material";
import { Link } from "react-router-dom";
import user from "../../assets/user.svg";
import shoppingBag from "../../assets/shoppingbag.svg";
import SvgIcon from "@mui/material/SvgIcon";
function Navbar() {
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
          component="img"
          src={logo}
          sx={{
            width: 40,
            height: "auto",
          }}
        ></Box>
        <nav style={{ display: "flex", gap: "10px" }}>
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
          <Button sx={{ px: 5 }} component={Link} to="/underconstruction">
            <Box component="img" src={shoppingBag} alt="" sx={{ width: 20 }}></Box>
          </Button>
          <Button sx={{ px: 5 }} component={Link} to="/underconstruction">
            <Box component="img" src={user} alt="" sx={{ width: 18 }}></Box>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;
