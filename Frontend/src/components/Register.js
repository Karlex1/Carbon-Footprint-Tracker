import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, Container, Paper, Stack, TextField,
  Typography, Alert, CircularProgress, InputAdornment
} from '@mui/material';
import {
  Person, Badge, Phone, Lock
} from '@mui/icons-material';
import ForestRoundedIcon from '@mui/icons-material/ForestRounded';

function Register() {
  const initialform = {
    username: '',
    name: '',
    mobileno: '',
    password: ''
  };

  const [form, setForm] = useState(initialform);
  const [submitstatus, setSubmitstatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitstatus(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/newuser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        throw new Error(data.message || 'Registration failed');
      }
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
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper
        elevation={6}
        sx={{
          borderRadius: 4,
          bgcolor: '#ffffff',
          p: { xs: 3, md: 5 },
          border: '1px solid #e8f5e9'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <ForestRoundedIcon sx={{ color: '#4caf50', fontSize: 40, mb: 1 }} />
          <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
            Join the Green Journey
          </Typography>
          <Typography variant="body1" sx={{ color: '#689f38' }}>
            Start tracking your footprint in India
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
              value={form.username}
              required
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#81c784' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Full Name"
              name="name"
              value={form.name}
              required
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge sx={{ color: '#81c784' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Mobile Number"
              name="mobileno"
              type="tel"
              value={form.mobileno}
              required
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone sx={{ color: '#81c784' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              required
              onChange={handleChange}
              fullWidth
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
              size="large"
              disabled={loading}
              sx={{
                bgcolor: '#2e7d32',
                '&:hover': { bgcolor: '#1b5e20' },
                borderRadius: 2,
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Register Now"}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#2e7d32', textDecoration: 'none', fontWeight: 'bold' }}>
                  Login here
                </Link>
              </Typography>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default Register;