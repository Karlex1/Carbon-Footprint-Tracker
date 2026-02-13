import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material'
function Register() {
  const initialform = {
    username: '',
    name: '',
    mobileno: '',
    password: ''
  }
  const [form, setForm] = useState(initialform)
  const [submitstatus, setSubmitstatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitstatus(null);
    try {
      const response = await fetch('http://localhost:5000/newuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(form)
      })
      //error handling
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/');
      } else {
        throw new Error(data.message || response.status);
      }
      setSubmitstatus({ type: 'success', message: `Registered` })
      setForm(initialform);
    } catch (e) {
      setSubmitstatus({ type: 'error', message: `failed to register ${e.message}` })
      // setForm(initialform);
    } finally {
      setLoading(false);

    }
  }
  const handleChange = (e) => {
    // const { username, name, password, mobileno } = e.target;
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev, [name]: value
    }))
  }
  return (
    <Container className="App" maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={5} sx={{ borderRadius: 4, bgcolor: '#f1f8e9', p: 4, border: '1px solid #c8e6c9' }}>
        
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
              Join the Green Journey
            </Typography>
            <Typography variant="body2" sx={{ color: '#558b2f' }}>
              Start tracking your footprint in India
            </Typography>
          </Box>
          <form onSubmit={onSubmit}><Stack spacing={2.5}>
          <TextField type="text" placeholder='username' name='username' value={form.username} required onChange={handleChange} fullWidth />
          
            <TextField type="text" placeholder='name' name='name' value={form.name} required onChange={handleChange} />
            <TextField type="tel" placeholder='mobileno' name='mobileno' value={form.mobileno} required onChange={handleChange} />
            <TextField type="password" placeholder='password' name='password' value={form.password} required onChange={handleChange} />

            <Button type="submit">{loading ? "registering" : "register"}</Button>
            {submitstatus && <p>{submitstatus.message}</p>}
</Stack>
          </form>
      </Paper>
    </Container>)
}

export default Register