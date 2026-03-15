import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useMemo } from 'react';
import { createTheme, ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';

// Components
import Login from "./components/Login";
import Questionaire from "./components/Questionaire";
import Register from "./components/Register";
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import './App.css';
// Contexts
import { AuthProvider, AuthContext } from './components/AuthContext';
import { LanguageProvider } from './components/LangContext';
import User from './components/User';

/**
 * Custom Nature-Themed Global Styles
 * Ensuring consistent typography and button styles across the app.
 */

const getTheme = (mode) => createTheme({
  
  palette: {
    mode,
    primary: {
      main: '#1b5e20', // Deep Forest Green
      dark: '#003300',
      light: '#4c8c4a',
    },
    success: {
      main: '#4caf50',
      dark: '#2e7d32',
    },
    background: {
      default: '#f4f7f4', // Very light mint-grey
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 900 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' },
      },
    },
  },
});

const ProtectedRouter = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f4f7f4' }}>
        <CircularProgress color="success" thickness={5} />
      </Box>
    );
  }

  return token ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const { token } = useContext(AuthContext);
  const theme = useMemo(() => getTheme('light'), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Standardizes CSS across browsers */}
      <Router>
        {/* Header only appears when logged in */}
        {token && <Header />}

        <Box sx={{ minHeight: 'calc(100vh - 64px)' }}>
          <Routes>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />

            {/* Protected Routes */}
            <Route path='/' element={
              <ProtectedRouter>
                <Questionaire />
              </ProtectedRouter>
            } />

            <Route path='/dashboard' element={
              <ProtectedRouter>
                <Dashboard />
              </ProtectedRouter>
            } />


            <Route path='/profile' element={
              <ProtectedRouter>
                <User />
              </ProtectedRouter>
            } />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;