import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Divider, IconButton } from "@mui/material";
import { auth } from "../firebase/firebase";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { signOutUser } from "../firebase/Auth";

function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName,
        email: currentUser.email,
        photo: currentUser.photoURL,
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error.message);
      alert("Failed to sign out. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        background: "background.default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >

    <Navbar />

      {user ? (
        <Box
          sx={{
            width: "100%",
            maxWidth: "500px",
            textAlign: "center",
            mt: 4,
            px: 3,
          }}
        >
          <img
            src={user.photo}
            alt="User Profile"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              marginBottom: "20px",
              border: "3px solid #3A7AFE",
            }}
          />
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", mb: 1, color: "text.primary" }}
          >
            {user.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
            {user.email}
          </Typography>
          <Divider sx={{ my: 3 }} />

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: "8px",
              fontSize: "1rem",
              mb: 2,
            }}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </Box>
      ) : (
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            mt: 4,
          }}
        >
          Loading user details...
        </Typography>
      )}
    </Box>
  );
}

export default UserProfile;
