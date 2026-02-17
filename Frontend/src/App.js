import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Login";
import Questionaire from "./components/Questionaire";
import Register from "./components/Register";
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { AuthProvider,AuthContext } from './components/AuthContext';
import { useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Protectedrouter = ({ children }) => {
  const {token }=useContext(AuthContext)
  return token ? children : <Navigate to='/login' />
}

const theme = createTheme({
  typography: {
    // Setting Poppins as the primary font for the dashboard
    fontFamily: '"Poppins", "Inter", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#1b5e20', 
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    // Using a slightly more technical look for the big emission number
    h3: {
      fontWeight: 700,
      letterSpacing: '-1px',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16, // Softer, more modern corners for your cards
        },
      },
    },
  },
});

const Appcontent = () => {
  const { token } = useContext(AuthContext);
  return (
      <Router>
        {token && <Header />}
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={
            <Protectedrouter>
              <Questionaire />
            </Protectedrouter>
          } />
          <Route path='/dashboard' element={<Protectedrouter>
          <ThemeProvider theme={theme}> <Dashboard /></ThemeProvider> 
          </Protectedrouter>} />

        </Routes>
      </Router>)
}

function App() {
  return (<AuthProvider>
    <Appcontent/>
    </AuthProvider>
  );
}

export default App;
