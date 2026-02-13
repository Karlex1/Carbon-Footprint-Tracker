import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useContext } from 'react';

function Login() {
  const initialform = {
    username: '',
    password: ''
  }
  const navigate = useNavigate();
  const [form, setForm] = useState(initialform);
  const [submitstatus, setSubmitstatus] = useState(null);
  const { login } = useContext(AuthContext)
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(form)
      })
      //error handling
      const data = await response.json();
      if (!response.ok) {
        const errordata = await response.json();
        throw new Error(errordata.Message || `${response.status}`)
      } else {
        login(data.name, data.token)
        navigate('/')
      }
      setSubmitstatus({ type: 'sucess', message: 'login sucessful' })
      setForm(initialform);

    } catch (e) {
      setSubmitstatus({ type: 'error', message: `failed to login ${e.message}` })
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev, [name]: value
    }))
  }
  const handlenew = () => {
    navigate('/register')
  }
  return (
    <form onSubmit={onSubmit}>
      <input type="text" placeholder='username' name='username' value={form.username} required onChange={handleChange} />
      <input type="password" placeholder='password' name='password' value={form.password} required onChange={handleChange} />
      <button type="submit">login</button>
      <p>New to CFT... <button onClick={handlenew}>Register</button></p>
      {submitstatus && <p>{submitstatus.message}</p>}
    </form>
  )
}

export default Login