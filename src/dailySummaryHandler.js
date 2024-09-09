import React, { useState, useEffect } from 'react';
import DailySummary from './DailySummary';

const DailySummaryHandler = () => {
  // Obtener tareas del almacenamiento local al montar el componente
  const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const [tasks, setTasks] = useState(storedTasks);

  // Lógica para guardar las tareas en el almacenamiento local cada vez que se actualizan
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div>
      <h1>Time Tracking App</h1>
      <DailySummary tasks={tasks} setTasks={setTasks} />
    </div>
  );
};

export default DailySummaryHandler;
