import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { auth, signOutUser } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user details
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName,
        email: currentUser.email,
        photo: currentUser.photoURL,
      });
    } else {
      navigate('/login'); // Redirect to login if user is not authenticated
    }
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate('/login'); // Redirect to login after sign-out
    } catch (error) {
      console.error('Error signing out:', error.message);
      alert('Failed to sign out. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #f6f8ff, #ffffff)',
        textAlign: 'center',
      }}
    >
      {user ? (
        <>
          <img
            src={user.photo}
            alt="User Profile"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              marginBottom: '20px',
            }}
          />
          <Typography variant="h5" sx={{ mb: 2 }}>
            Welcome, {user.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4, color: '#666666' }}>
            {user.email}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              borderRadius: '8px',
            }}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </>
      ) : (
        <Typography variant="h6" sx={{ color: '#666666' }}>
          Loading user details...
        </Typography>
      )}
    </Box>
  );
}

export default Dashboard;
