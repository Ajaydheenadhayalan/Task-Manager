import React, { useEffect, useState, useContext } from 'react'
import API from '../services/api'
import TaskCard from '../components/TaskCard'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Dashboard(){
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    try{
      const res = await API.get('/tasks', { params: { page, limit: 10, q, status } });
      setTasks(res.data.data);
    }catch(err){ console.error(err); }
    setLoading(false);
  }

  useEffect(()=>{ fetchTasks(); }, [page, q, status]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try{ await API.delete(`/tasks/${id}`); fetchTasks(); }catch(err){ alert('Delete failed'); }
  }

  const handleEdit = (task) => { navigate(`/edit/${task.id}`); }

  return (
    <div className="container">
      <div className="grid">
        <div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <h2>Dashboard</h2>
            <div className="header-actions">
              <Link to="/create"><button className="btn">Create Task</button></Link>
            </div>
          </div>

          <div className="card panel">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <input className="search" placeholder="Search title or description" value={q} onChange={e=>setQ(e.target.value)} />
              <select className="search" value={status} onChange={e=>setStatus(e.target.value)} style={{width:160}}>
                <option value="">All statuses</option>
                <option value="pending">pending</option>
                <option value="in-progress">in-progress</option>
                <option value="completed">completed</option>
              </select>
            </div>

            <div className="tasks-list">
              {loading ? <p>Loading...</p> : (
                tasks.length ? tasks.map(t => (
                  <TaskCard key={t.id} task={t} onEdit={user?.role === 'admin' || t.createdBy === user?.id ? handleEdit : null} onDelete={user?.role === 'admin' || t.createdBy === user?.id ? handleDelete : null} />
                )) : <p className="small">No tasks found — try creating one.</p>
              )}
            </div>

            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
              <div className="small">Page {page}</div>
              <div>
                <button className="btn ghost" onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
                <button className="btn" onClick={()=>setPage(p=>p+1)} style={{marginLeft:8}}>Next</button>
              </div>
            </div>
          </div>
        </div>

        <aside>
          <div className="card panel">
            <h3>Overview</h3>
            <p className="small">Logged in as <strong>{user?.username}</strong></p>
            <p className="small">Role: <strong>{user?.role}</strong></p>
            <div style={{marginTop:12}}>
              <p className="small">Quick actions</p>
              <Link to="/create"><button className="btn" style={{width:'100%'}}>New Task</button></Link>
            </div>
            <div className="footer">Task Manager • Built with ❤️</div>
          </div>
        </aside>
      </div>
    </div>
  )
}
