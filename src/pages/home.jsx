import React, { useState } from 'react';
import { 
  Box,
  Typography, 
  Button,
  IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from "../ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";


function HomePage() {
  const navigate = useNavigate();
  const { toggleTheme, theme } = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        background: 'background.default',
        color: 'text.primary',
        p: 3,
      }}
    >
      <IconButton onClick={toggleTheme} color="inherit" sx={{ mr: 1 }}>
          {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>

      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            color: 'primary.main',
          }}
        >
          ChatSphere
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            mt: 2,
            fontSize: { xs: '1rem', sm: '1.2rem' },
            color: 'text.secondary',
            maxWidth: '600px',
          }}
        >
          A next-gen chat app built with React, Firebase, and Material UI.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{
            mt: 4,
            px: 6,
            py: 1,
            fontSize: '1.2rem',
            borderRadius: '8px',
          }}
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      </Box>

      <Box>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.9rem',
            textAlign: 'center',
            color: 'text.secondary',
          }}
        >
          Built by Uzair with ❤️
        </Typography>
      </Box>
    </Box>
  );
}

export default HomePage;
