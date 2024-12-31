import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { signInWithGoogle } from '../firebase';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      console.log('Logged in user:', user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      const user = await signInWithGoogle();
      console.log('Signed up user:', user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during signup:', error.message);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        bgcolor: 'background.default',
        color: 'text.primary',
        px: 3,
      }}
    >
      <Typography
        variant="h2"
        sx={{
          mb: 4,
          fontWeight: 'bold',
          color: 'primary.main',
          fontFamily: 'Inter, Roboto, sans-serif',
          textAlign: 'center',
          fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }, // Responsive font size
        }}
      >
        Welcome to ChatSphere
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          mb: 6,
          color: 'text.secondary',
          textAlign: 'center',
          maxWidth: { xs: '90%', sm: '400px' },
          fontSize: { xs: '0.9rem', sm: '1rem' },
        }}
      >
        Sign in or Sign up with Google to get started!
      </Typography>

      <Button
        variant="outlined"
        sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: { xs: '90%', sm: '280px' }, // Responsive width
          height: '48px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #DADCE0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textTransform: 'none',
          fontSize: '16px',
          fontWeight: '500',
          color: '#3C4043',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#F7F8F8',
          },
        }}
        onClick={handleSignIn}
      >
        <img
          src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Search_logo.max-2800x2800.png"
          alt="Google logo"
          style={{ width: '20px', height: '20px', marginRight: '12px' }}
        />
        Log in with Google
      </Button>

      <Divider
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '80%',
          my: 3,
          position: 'relative',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'background.default',
            px: 1,
            color: 'text.secondary',
          }}
        >
          OR
        </Typography>
      </Divider>

      <Button
        variant="outlined"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: { xs: '90%', sm: '280px' },
          height: '48px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #DADCE0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textTransform: 'none',
          fontSize: '16px',
          fontWeight: '500',
          color: '#3C4043',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#F7F8F8',
          },
        }}
        onClick={handleSignUp}
      >
        <img
          src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Search_logo.max-2800x2800.png"
          alt="Google logo"
          style={{ width: '20px', height: '20px', marginRight: '12px' }}
        />
        Sign up with Google
      </Button>
    </Box>
  );
}

export default AuthPage;