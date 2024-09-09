import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import DailySummary from './DailySummary';
import './App.css';
import ObjectiveManagerPage from './ObjectiveManagerPage';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { CirclePlus, LogOutIcon } from 'lucide-react';
import Particles from 'particlesjs';
import { Lumiflex } from "uvcanvas";
import { ListMusic } from 'lucide-react';



const App = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState({
    nombre: '',
    descripcion: '',
  });
  const CLIENT_ID = "d0fbac16669147cabfe8fec7ccbfd78f"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [nameOptions, setNameOptions] = useState([]);
  const [newName, setNewName] = useState('');
  const [token, setToken] = useState("")
  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
}
  useEffect(() => {
    fetchDailySummaryFromBackend();
    fetchNameOptionsFromBackend();
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }

    setToken(token)
  }, []); 

  const startTask = (taskName, taskDescription) => {
    setCurrentTask({
      nombre: taskName,
      descripcion: taskDescription,
    });
    setIsTimerRunning(true);
    setStartTime(Date.now());
  };

  const stopTask = async () => {
    if (isTimerRunning) {
      const endTime = Date.now();
      const elapsedTimeInSeconds = Math.floor((endTime - startTime) / 1000);

      try {
        const response = await fetch('http://localhost:3001/guardar-tarea', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: currentTask.nombre,
            descripcion: currentTask.descripcion,
            nuevo_tiempo: elapsedTimeInSeconds,
          }),
        });

        if (!response.ok) {
          throw new Error('Error al guardar la tarea en el servidor.');
        }

        console.log('Tarea guardada correctamente en el servidor.');
        fetchDailySummaryFromBackend();
      } catch (error) {
        console.error('Error al enviar la tarea al backend:', error);
      }

      setIsTimerRunning(false);
      setCurrentTask({
        nombre: '',
        descripcion: '',
      });
    }
  };

  const fetchDailySummaryFromBackend = async () => {
    try {
      const response = await fetch('http://localhost:3001/obtener-tareas');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener el resumen diario desde el servidor.');
      }

      console.log('Datos recibidos desde el servidor:', data);

      if (Array.isArray(data.content)) {
        setTasks(data.content);
      } else {
        console.error('Los datos recibidos no son un array:', data.content);
      }
    } catch (error) {
      console.error('Error al obtener el resumen diario desde el servidor:', error);
    }
  };

  const fetchNameOptionsFromBackend = async () => {
    try {
      const response = await fetch('http://localhost:3001/obtener-nombres');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener nombres desde el servidor.');
      }

      console.log('Nombres recibidos desde el servidor:', data);

      if (Array.isArray(data.content)) {
        setNameOptions(data.content);
      } else {
        console.error('Los datos recibidos no son un array:', data.content);
      }
    } catch (error) {
      console.error('Error al obtener nombres desde el servidor:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3001/borrar-tarea/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al borrar la tarea en el servidor.');
      }

      console.log('Tarea borrada correctamente en el servidor.');
      fetchDailySummaryFromBackend();
    } catch (error) {
      console.error('Error al borrar la tarea en el backend:', error);
    }
  };

  const handleNameChange = (e) => {
    setCurrentTask({ ...currentTask, nombre: e.target.value });
  };

  const handleNewNameChange = (e) => {
    setNewName(e.target.value);
  };

  const addNewName = async () => {
    try {
      const response = await fetch('http://localhost:3001/agregar-nombre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nuevoNombre: newName,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el nuevo nombre en el servidor.');
      }

      console.log('Nuevo nombre agregado correctamente en el servidor.');
      fetchNameOptionsFromBackend();
    } catch (error) {
      console.error('Error al enviar el nuevo nombre al backend:', error);
    }
  };

  return (
    <Router>
      <div  className='absolute w-max-96 h-screen op-0 right-0 bottom-0 left-0 z-[-2] transform top-0  bg-rose-950 mb-0 bg-gradient-to-r from-purple-500 to-pink-500'>
      
        
        <header className='sticky py-5 flex flex-row top-0 left-0 right-0 backdrop-blur-md'>
          <h1 className='text-white text-3xl pt-2 fuenteperso'>WHAT IF I FALL
            but WHAT IF YOU FLY
          </h1>
          
          <nav className='text-white flex flex-row ml-64 pt-2 fuenteperso text-3xl gap-x-6 '>
            <Link  className='hover:backdrop-blur-3xl hover:text-rose-950' to="/">Inicio</Link>
            <Link className='hover:backdrop-blur-3xl hover:text-rose-950 ' to="/daily-summary">Historial Tareas</Link>
            <Link className='hover:backdrop-blur-3xl hover:text-rose-950' to="/objective-manager">Gestión de Objetivos</Link>
            {!token ?
            <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}><ListMusic /></a>
            : <button onClick={logout}><LogOutIcon/></button>}
          </nav>
        </header>
       
        <div className=''>
        <div className='container mx-auto justify-items-center'>
        <div className=' mx-auto '> 
        <div className='flex flex-row justify-items-center pl-10'>
          <div className="flex flex-col ">

                 <label htmlFor="taskName" className='text-white font-bold'>Nombre Tarea:</label>
                 <select className='form-select text-black rounded-lg mb-2 bg-green-300' id="taskName" value={currentTask.nombre} onChange={handleNameChange}>
                   <option value="" className='text-white font-bold' disabled>Seleccione un nombre...</option>
                   {nameOptions.map((name) => (
                     <option key={name.id} value={name.nombre}>{name.nombre}</option>
                   ))}
                 </select>
                 </div>
                 <div className='flex flex-row ml-4 items-center justify-items-stretch '>
                    <input type="text" placeholder="Nuevo nombre" value={newName} onChange={handleNewNameChange} className=' form-input mt-7 bg-red-300 rounded text-white'/>
                    <button className=" ml-3 mt-3 rounded-full text-green-300 hover:bg-green-300 hover:p-2 hover:text-black hover:ml-1" onClick={addNewName} disabled={isTimerRunning}>
                      <CirclePlus size={40}/>
                    </button>
                 </div>
        </div>

        <div className='flex flex-col'>
          <label htmlFor="taskDescription" className='text-white font-bold'> Descripción: </label>
          <textarea
          className='bg-transparent text-white border-2 border-white border-dashed rounded-xl '
            id="taskDescription"
            value={currentTask.descripcion}
            onChange={(e) => setCurrentTask({ ...currentTask, descripcion: e.target.value })}
          />
        </div>
        </div>
       
       
        <div classname="pt-10"> 
        
        <Timer isRunning={isTimerRunning} />
        <div className='flex flex-row gap-5 justify-items-center justify-center mt-4'>
        <button className="rounded-full border border-green-400 text-pink-600 bg-green-300  font-bold text-1xl  p-5 " onClick={() => startTask(currentTask.nombre, currentTask.descripcion)} disabled={isTimerRunning}>
          Start Task
        </button>
        <button className="rounded-full border-slate-400 text-white bg-red-300 p-5 font-bold text-1xl hover:cursor-pointer" onClick={stopTask} disabled={!isTimerRunning}>
          Stop Task
        </button>
        </div>
        </div>
        
        
        </div>
        </div>
        
      <Routes>
        <Route
          path="/daily-summary"
          element={<DailySummary tasks={tasks} onDeleteTask={handleDeleteTask} nameOptions={nameOptions} />}
        />
        <Route
          path="/objective-manager"
          element={<ObjectiveManagerPage nameOptions={nameOptions} />}
        />
        {/* Otras rutas según tu aplicación */}
      </Routes>
      </div>
      

      
    </Router>
  );
};

export default App;