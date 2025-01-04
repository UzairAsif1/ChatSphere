import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { signOutUser } from '../firebase/Auth';

function Navbar() {
  const handleLogout = async () => {
    await signOutUser();
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
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
