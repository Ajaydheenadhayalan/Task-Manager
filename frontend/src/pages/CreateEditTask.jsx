import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../services/api'
import TaskForm from '../components/TaskForm'

export default function CreateEditTask(){
  const { id } = useParams();
  const [initial, setInitial] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    if (id){
      setLoading(true);
      API.get(`/tasks/${id}`)
        .then(res=>setInitial(res.data))
        .catch(()=>alert('Cannot fetch task'))
        .finally(()=>setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (payload) => {
    try{
      if (id) await API.put(`/tasks/${id}`, payload);
      else await API.post('/tasks', payload);
      navigate('/');
    }catch(err){ 
      alert(err.response?.data?.message || err.message); 
    }
  }

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <div style={{maxWidth:720, margin:'30px auto'}}>
        <TaskForm initial={initial} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
