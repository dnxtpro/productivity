import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Bar } from 'react-chartjs-2';
import { Chart, LinearScale, CategoryScale, TimeScale, Title, Tooltip, Legend } from 'chart.js/auto'; // Adjust the path based on your 'chart.js' version

const DailySummary = ({ tasks: initialTasks, onDeleteTask, nameOptions }) => {
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState(initialTasks);
  const [nameFilter, setNameFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(new Date());
  const [totalTime, setTotalTime] = useState(0);
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    setTasks(initialTasks);
    calculateTotalTime(initialTasks);
    generateDailyData(initialTasks);
  }, [initialTasks]);

  const dailyHoursOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value + ' min';
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'right',
        // Puedes cambiar 'top' por 'bottom', 'right', 'left'
      },
    },
    elements: {
      bar: {
        backgroundColor: 'rgba(255, 99, 132, 0.8)', // Cambia estos valores según tus preferencias
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        borderRadius:10,
      },
    },
  };
  

  const subjectHoursOptions = {
    title: {
      text: 'Hours Studied per Subject',
    },
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes} min ${seconds} s`;
  };

  const calculateTotalTime = (filteredTasks) => {
    const totalTimeInSeconds = filteredTasks.reduce((total, task) => total + task.nuevo_tiempo, 0);
    setTotalTime(totalTimeInSeconds);
  };

  const generateDailyData = (filteredTasks) => {
    const dailyHours = {};
    filteredTasks.forEach((task) => {
      const taskDate = new Date(task.fecha_creacion).toLocaleDateString();
      
      dailyHours[taskDate] = (dailyHours[taskDate] || 0) + task.nuevo_tiempo;
    });
  
    const dates = Object.keys(dailyHours);
    const data = dates.map((date) => dailyHours[date] / 60); 
  
    setDailyData({
      labels: dates,
      datasets: [
        {
          label: 'Minutos Estudiados',
          data: data || [],  // Ensure data is not undefined
          backgroundColor: 'rgba(252, 96, 177, 0.8)',
          borderColor: 'rgba(147, 9, 145, 1)',
          borderWidth: 5,
          
        },
      ],
    });
  };
  const renderChart = () => {
    // Ensure the canvas is not null
    const canvas = document.getElementById('dailyChart');
    if (canvas) {
      // Destroy existing chart
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create new chart
      new Chart(ctx, {
        type: 'bar',
        data: dailyData,
        options: dailyHoursOptions,
      });
    }
  };
  const filterTasks = () => {
    let filteredTasks = initialTasks;

    if (nameFilter) {
      filteredTasks = filteredTasks.filter(task => task.nombre === nameFilter);
    }

    if (dateFilter) {
      const nextDate = new Date(dateFilter);
      nextDate.setDate(nextDate.getDate() + 1);
      filteredTasks = filteredTasks.filter(task => {
        const taskDate = new Date(task.fecha_creacion);
        return taskDate >= dateFilter && taskDate < nextDate;
      });
    }

    setTasks(filteredTasks);
    calculateTotalTime(filteredTasks);
    generateDailyData(filteredTasks);
  };

  const handleDeleteTask = async (taskId) => {
    onDeleteTask(taskId);
  };

  return (
    <div className='container mx-auto overflow-auto '>
    <div className='container mx-auto overflow-auto mt-4 max-h-60'>
      <h2 className='text-4xl antialised text-blue-300'>Historial Tareas</h2>
      
      <div className='flex mt-4 flex-col gap-2 font-4xl items content-center'>
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map((task, index) => (
            <div key={index} className="task-item">
              <span>
                <strong>{task.nombre}</strong>: {task.descripcion} - Time: {formatTime(task.nuevo_tiempo)}
              </span>
              <button className="button-35" onClick={() => handleDeleteTask(task.id)}>
                <img
                  src="https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/delete-icon.png"
                  alt="Delete Icon"
                  className="delete-icon"
                />
              </button>
            </div>
          ))
        ) : (
          <p>No hay resumen diario disponible.</p>
        )}
       
      </div>
      
    </div>
    {totalTime > 0 && <p>Total Time: {formatTime(totalTime)}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
    <div className='h-96'>
        {dailyData && dailyData.datasets ? (
          <Bar data={dailyData} options={dailyHoursOptions} />
        ) : (
          <p>No data available for the chart.</p>
        )}
      </div>
    </div>
  );
};

export default DailySummary;
