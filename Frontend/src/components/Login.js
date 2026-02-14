import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import {
  Box, Button, Container, Paper, Stack, TextField,
  Typography, Alert, CircularProgress, InputAdornment
} from '@mui/material';
import { Person, Lock } from '@mui/icons-material';
import ForestRoundedIcon from '@mui/icons-material/ForestRounded';

function Login() {
  const initialform = {
    username: '',
    password: ''
  };

  const navigate = useNavigate();
  const [form, setForm] = useState(initialform);
  const [submitstatus, setSubmitstatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitstatus(null);

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`);
      }

      // Success logic
      login(data.name, data.token);
      navigate('/');

    } catch (e) {
      setSubmitstatus({ type: 'error', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper
        elevation={6}
        sx={{
          borderRadius: 4,
          p: 4,
          textAlign: 'center',
          border: '1px solid #e8f5e9'
        }}
      >
        <Box sx={{ mb: 3 }}>
          <ForestRoundedIcon sx={{ color: '#2e7d32', fontSize: 48, mb: 1 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Continue your green journey
          </Typography>
        </Box>

        <form onSubmit={onSubmit}>
          <Stack spacing={3}>
            {submitstatus && (
              <Alert severity={submitstatus.type} sx={{ borderRadius: 2 }}>
                {submitstatus.message}
              </Alert>
            )}

            <TextField
              label="Username"
              name="username"
              variant="outlined"
              fullWidth
              required
              value={form.username}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#81c784' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={form.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#81c784' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                bgcolor: '#2e7d32',
                fontWeight: 'bold',
                '&:hover': { bgcolor: '#1b5e20' }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>

            <Typography variant="body2">
              New to CFT?{' '}
              <Link to="/register" style={{ color: '#2e7d32', fontWeight: 'bold', textDecoration: 'none' }}>
                Create an Account
              </Link>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default Login;