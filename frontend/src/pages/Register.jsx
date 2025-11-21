import React, { useState, useContext } from 'react'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Register(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try{
      const res = await API.post('/register', { username, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/');
    }catch(err){ setError(err.response?.data?.message || err.message); }
  }

  return (
    <div className="container">
      <div style={{maxWidth:480, margin:'40px auto'}}>
        <div className="card">
          <h2>Register</h2>
          {error && <p style={{color:'#ff6b6b'}}>{error}</p>}
          <form onSubmit={handle}>
            <div style={{marginBottom:10}}>
              <input className="input" placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} required />
            </div>
            <div style={{marginBottom:10}}>
              <input className="input" type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <button className="btn" type="submit">Register</button>
              <a href="/login" className="small">Already have an account?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
