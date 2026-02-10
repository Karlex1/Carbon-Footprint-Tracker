import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
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
        localStorage.setItem('user',JSON.stringify(data.user))
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
    <div className="App">
      <form onSubmit={onSubmit}>
        <input type="text" placeholder='username' name='username' value={form.username} required onChange={handleChange} />
        <input type="text" placeholder='name' name='name' value={form.name} required onChange={handleChange} />
        <input type="tel" placeholder='mobileno' name='mobileno' value={form.mobileno} required onChange={handleChange} />
        <input type="password" placeholder='password' name='password' value={form.password} required onChange={handleChange} />

        <button type="submit">{loading ? "registering" : "register"}</button>
        {submitstatus && <p>{submitstatus.message}</p>}

      </form>
    </div>)
}

export default Register