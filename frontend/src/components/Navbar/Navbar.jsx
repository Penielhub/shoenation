import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import logo from "../../assets/logo.svg"
import Box from "@mui/material/Box"
import { Height } from "@mui/icons-material";
function Navbar() {
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "transparent",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          px:3,
          py:3,
          width: "100%",
          display: "flex",
          gap: 6
        }}
      >
        <Box component="img" src={logo} sx={{
          width:50, height:"auto",
        }}></Box>
        <nav style={{display:"flex", gap:"10px"}}>
          <Button >SALE</Button>
          <Button >Men</Button>
          <Button>Women</Button>
          <Button>Kids</Button>
        </nav>
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;
