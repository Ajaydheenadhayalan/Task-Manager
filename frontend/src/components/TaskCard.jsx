import React from 'react'

export default function TaskCard({ task, onEdit, onDelete }){
  return (
    <div className="task-card">
      <div className="task-title">
        <h3>{task.title}</h3>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div className={`badge ${task.status.replace(' ','-')}`}>{task.status}</div>
        </div>
      </div>

      <div className="task-desc">{task.description || <em style={{color:'var(--muted)'}}>No description</em>}</div>

      <div className="task-meta">
        <small className="small">Created: {new Date(task.createdAt).toLocaleString()}</small>
        <div>
          {onEdit && <button className="btn ghost" onClick={()=>onEdit(task)}>Edit</button>}
          {onDelete && <button className="btn" onClick={()=>onDelete(task.id)} style={{marginLeft:8}}>Delete</button>}
        </div>
      </div>
    </div>
  )
}
