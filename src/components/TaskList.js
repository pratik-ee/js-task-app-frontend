import React, { useEffect } from 'react'
import TaskForm from './TaskForm'
import Task from './Task'
import { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import loadingImage from'../assets/loader.gif';
import { URL } from '../App'

const TaskList = () => {
    const [formData,setFormData]=useState({
     name: "",
     completed:false
    })
    const [tasks,setTasks]=useState([]);
    const [completedTask,setCompletedTasks]=useState([]);
    const [isLoading,setIsLoading]=useState(false);
    const [isEditing,setIsEditing]=useState(false);
    const [taskId,setTaskId]=useState("");
    const {name}=formData;
    const handeleInputChange = (e) =>{
      const{name,value}=e.target;
      setFormData({...formData,[name]:value});
    } 
    const createTask=async (e) =>{
      e.preventDefault();
      if(name===""){
        return toast.error("Input Cannot Be empty");
      }
      try {
        await axios.post(`${URL}/api/task`,formData);
        toast.success("task added successfully");
        setFormData({...formData,[name]:""});
        getTasks();
      } catch (error) {
        toast.error(error);
        console.log(error);
      }
   
    } 
    const getTasks=async()=>{
      setIsLoading(true);
      try {
        const{data}=await axios.get(`${URL}/api/task`);
        setTasks(data)
        console.log(data);
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
      }
    };
    const deleteTask=async(id)=>{
     try {
      await axios.delete(`${URL}/api/task/${id}`);
      getTasks()
     } catch (error) {
      toast.error(error);
      
     }

    }
    useEffect(()=>{
      const cTasks=tasks.filter((task)=>{return task.completed===true})
      setCompletedTasks(cTasks);
    },[tasks])
    const getSingleTask=async(task)=>{
     setFormData({name:task.name,completed:false})
     setTaskId(task._id);
     setIsEditing(true)

    }
    const updateTask=async(e)=>{
      e.preventDefault();
      if(name===""){
        return toast.error("input field cannot be empty");

      }
      try {
        await axios.put(`${URL}/api/task/${taskId}`,formData);
        setFormData({...formData,name:""});
        setIsEditing(false);
        getTasks()

      } catch (error) {
        toast.error(error.message);
      }
    }
    const setToComplete=async(task)=>{
      const newFormData={
        name:task.name,
        completed:true
      }
      try {
        await axios.put(`${URL}/api/task/${task._id}`,newFormData);
        getTasks()
      } catch (error) {
        toast.error(error.message)
      }

    }
    useEffect(()=>{
        getTasks()
    },[])
  return (
   
    <div>
      <h2>Tasks</h2>
      <TaskForm name={name} handleInputChange={handeleInputChange} createTask={createTask} isEditing={isEditing} updateTask={updateTask}/>
     {tasks.length >0 && (<div className="--flex-between --pb">
        <p>
            <b>Total Tasks:</b>{tasks.length}
        </p>
        <p>
            <b>Completed Tasks:</b>{completedTask.length}
        </p>
      </div>
      )}
      <hr/>
      {
        isLoading && (<div className='--flex-center'>
            <img src={loadingImage} alt="loading plz wait" />
        </div>)
      }
      {
        !isLoading && tasks.length===0 ?(<p>No task added </p>):(
            <>
            {
                tasks.map((tasks,index)=>{
                    return(
                        <Task key={tasks._id} task={tasks} index={index} deleteTask={deleteTask} getSingleTask={getSingleTask} setToComplete={setToComplete}/>
                    )
                })
            }
            </>
        )
      }
    </div>
  )
}

export default TaskList

