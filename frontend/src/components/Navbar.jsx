import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar(){
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <nav className="appbar card" style={{margin:'20px'}}>
      <div className="app-title">
        <div className="logo">TM</div>
        <div>
          <h1 style={{margin:0}}>Task Manager</h1>
        </div>
      </div>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="small">{user.username} • <strong style={{color:'white'}}>{user.role}</strong></span>
            <button className="btn" onClick={()=>navigate('/')}>Dashboard</button>
            <button className="btn ghost" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
