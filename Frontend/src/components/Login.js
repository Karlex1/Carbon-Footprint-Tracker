import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom';

function Login() {
  const initialform = {
    username: '',
    password: ''
  }
  const navigate = useNavigate();
  const [form, setForm] = useState(initialform)
  // const [username, setUsername] = useState('')
  // const [name, setName] = useState('');
  // const [mobileNo, setMobileNo] = useState(0);
  const [submitstatus, setSubmitstatus] = useState(null);
  const onSubmit = async (e) => {
    e.preventDefault();
    // const userdata = {
    //   ...form
    // }
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(form)
      })
      //error handling
      const data=await response.json();
      if (!response.ok) {
        const errordata = await response.json();
        throw new Error(errordata.Message || `${response.status}`)
      } else {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/')
      }
      setSubmitstatus({ type: 'sucess', message: 'login sucessful' })
      setForm(initialform);

    } catch (e) {
      setSubmitstatus({ type: 'error', message: `failed to login ${e.message}` })
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
    <form onSubmit={onSubmit}>
      <input type="text" placeholder='username' name='username' value={form.username} required onChange={handleChange} />
      <input type="text" placeholder='password' name='password' value={form.password} required onChange={handleChange} />
      <button type="submit">login</button>
      {submitstatus && <p>{submitstatus.message}</p>}

    </form>
  )
}

export default Login