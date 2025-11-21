import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateEditTask from './pages/CreateEditTask';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" />;
  return children;
};

export default function App(){
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreateEditTask /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><CreateEditTask /></ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}
