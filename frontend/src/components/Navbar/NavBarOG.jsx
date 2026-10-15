import { useState } from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

import logo from "../../assets/logo.svg";
import user from "../../assets/user.svg";
import shoppingBag from "../../assets/shoppingbag.svg";

function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: "SALE", to: "/underconstruction" },
    { label: "Men", to: "/underconstruction" },
    { label: "Women", to: "/underconstruction" },
    { label: "Kids", to: "/underconstruction" },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "transparent",
          boxShadow: "none",
          color: "inherit",
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, md: 3 },
            py: { xs: 1, md: 3 },
            width: "100%",
            gap: { xs: 1, md: 6 },
          }}
        >
          {/* Mobile hamburger */}
          <IconButton
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
            sx={{
              display: { xs: "flex", md: "none" },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box
            component="img"
            src={logo}
            alt="ShoeNation"
            sx={{
              width: { xs: 32, md: 40 },
              height: "auto",
              flexShrink: 0,
            }}
          />

          {/* Desktop navigation */}
          <Box
            component="nav"
            sx={{
              display: { xs: "none", md: "flex" },
              gap: "10px",
            }}
          >
            {navLinks.map((item) => (
              <Button
                key={item.label}
                component={Link}
                to={item.to}
                variant="navbar"
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Shopping bag and profile */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 0.5, md: "10px" },
              ml: "auto",
              alignItems: "center",
            }}
          >
            <Button
              component={Link}
              to="/underconstruction"
              aria-label="Shopping bag"
              sx={{ minWidth: 0, px: { xs: 3, md: 3 } }}
            >
              <Box
                component="img"
                src={shoppingBag}
                alt=""
                sx={{ width: 23, height: 23, display: "block" }}
              />
            </Button>

            <Button
              component={Link}
              to="/underconstruction"
              aria-label="User profile"
              sx={{ minWidth: 0, px: { xs: 3, md: 3 } }}
            >
              <Box
                component="img"
                src={user}
                alt=""
                sx={{ width: 23, height: 23, display: "block" }}
              />
            </Button>
            <Button>
              
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 260 }} role="presentation">
          <List>
            {navLinks.map((item) => (
              <ListItemButton
                key={item.label}
                component={Link}
                to={item.to}
                onClick={() => setOpen(false)}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Button component={Link} to="/underconstruction" sx={{alignSelf:"center"}}>
          SALE
        </Button>
      </Drawer>
    </>
  );
}

export default Navbar;