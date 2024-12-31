import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  typography: {
    fontFamily: "'Inter', 'Roboto', 'sans-serif'",
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#3A7AFE', 
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00D97E', 
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFC', 
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E1E2F', 
      secondary: '#6C757D', 
    },
    divider: '#E5E9F2', 
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '10px', 
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: '#FF6B6B',
          color: '#FFFFFF',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  typography: {
    fontFamily: "'Inter', 'Roboto', 'sans-serif'",
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#3A7AFE',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00D97E', 
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#181A1B', 
      paper: '#242526', 
    },
    text: {
      primary: '#FFFFFF', 
      secondary: '#A0AEC0', 
    },
    divider: '#37474F', 
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '10px',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: '#FF6B6B', 
          color: '#FFFFFF',
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
