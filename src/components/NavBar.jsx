import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { signOutUser } from "../firebase/Auth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { auth } from "../firebase/firebase";

function Navbar() {
  const navigate = useNavigate();
  const { toggleTheme, theme } = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOutUser();
    navigate("/");
    window.location.reload();
  };

  const handleProfile = () => {
    navigate("/profile");
    handleMenuClose();
  };


  return (
    <AppBar position="static" sx={{ bgcolor: "primary.main" }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontFamily: "'Inter', 'Roboto', 'sans-serif'",
            color: "primary.contrastText",
          }}
        >
          ChatSphere
        </Typography>
        <IconButton onClick={toggleTheme} color="inherit" sx={{ mr: 1 }}>
          {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
        <IconButton onClick={handleMenuOpen} color="inherit">
          <Avatar src={auth.currentUser?.photoURL} alt={auth.currentUser?.displayName} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleProfile}>View Profile</MenuItem>
          <MenuItem onClick={handleLogout}>SignOut</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
