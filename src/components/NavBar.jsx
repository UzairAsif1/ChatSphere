import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { signOutUser } from "../firebase/Auth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

function Navbar() {
  const navigate = useNavigate();
  const { toggleTheme, theme } = useTheme();

  const handleLogout = async () => {
    await signOutUser();
    navigate("/");
    window.location.reload();
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
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
