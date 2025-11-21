import React, { useState } from 'react'

export default function TaskForm({ initial = {}, onSubmit }){
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');
  const [status, setStatus] = useState(initial.status || 'pending');

  return (
    <form onSubmit={(e)=>{ e.preventDefault(); onSubmit({ title, description, status }) }} className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <h3 style={{margin:0}}>{initial.id ? 'Edit Task' : 'Create Task'}</h3>
      </div>

      <div style={{marginBottom:10}}>
        <label className="small">Title</label>
        <input className="input" value={title} onChange={e=>setTitle(e.target.value)} required />
      </div>

      <div style={{marginBottom:10}}>
        <label className="small">Description</label>
        <textarea rows={4} className="input" value={description} onChange={e=>setDescription(e.target.value)} />
      </div>

      <div style={{marginBottom:12}}>
        <label className="small">Status</label>
        <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="pending">pending</option>
          <option value="in-progress">in-progress</option>
          <option value="completed">completed</option>
        </select>
      </div>

      <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
        <button type="submit" className="btn">Save</button>
      </div>
    </form>
  )
}
