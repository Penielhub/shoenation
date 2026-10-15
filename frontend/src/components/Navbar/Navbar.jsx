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
import ham from "../../assets/ham.svg";
import { useState } from "react";
import { Drawer } from "@mui/material";
function Navbar() {
  const [open, setOpen] = useState(false);
  const btnData = ["SALE", "Men", "Women", "Kids"];
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
        <Box
          component="nav"
          sx={{ gap: "10px", display: { xs: "none", md: "flex" } }}
        >
          {btnData.map((labels) => (
            <Button component={Link} to="/underconstruction">
              {labels}
            </Button>
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: "10px", ml: "auto" }}>
          <Button
            sx={{ px: { xs: 3, md: 5 } }}
            component={Link}
            to="/underconstruction"
          >
            <Box
              component="img"
              src={shoppingBag}
              alt=""
              sx={{ width: 24, height: 24 }}
            ></Box>
          </Button>
          <Button
            sx={{ px: { xs: 3, md: 5 } }}
            component={Link}
            to="/underconstruction"
          >
            <Box
              component="img"
              src={user}
              alt=""
              sx={{ width: 23, height: 23 }}
            ></Box>
          </Button>
          <Button
            sx={{ px: { xs: 3, md: 5 }, display: { xs: "flex", md: "none" } }}
            onClick={() => setOpen(true)}
          >
            <Box component="img" src={ham} sx={{ width: 23, height: 23 }}></Box>
          </Button>
        </Box>
        <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
          <Box sx={{ width: "100%", backgroundColor:"black", display:"flex", flexDirection:"column",py:3}}>
            {btnData.map((labels) => (
              <Button component={Link} to="/underconstruction" sx={{ py:2, borderRadius:0, bgcolor:"black",color:"white", fontSize:18, justifyContent:"flex-start"}}>
                {labels}
              </Button>
            ))}
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;
