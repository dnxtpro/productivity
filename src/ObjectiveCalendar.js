import React from 'react';
import Modal from 'react-modal';

const ObjectiveCalendar = ({ objectives, onDeleteObjective, onToggleObjectiveStatus, isOpen, onClose }) => {

    const customStyles = {
        content: {
          borderRadius: '20px',
          WebkitOverflowScrolling: 'touch',
          border: '5px solid #ccc',
          overflow: 'auto',
          width: '50%', // Ajusta el ancho según tus preferencias
          height: 'auto', // Ajusta la altura según tus preferencias
          top: '50%', // Centra verticalmente
          left: '50%', // Centra horizontalmente
          transform: 'translate(-50%, -50%)',
          backgroundColor:'rgba(250, 216, 214,1)' // Centra completamente
        },
        overlay: {
          
          backgroundColor: 'rgba(5, 5, 0, 0.2)', // Fondo semitransparente
        },
      };
      const sortedGroupedObjectives = groupAndSortObjectivesByDate(objectives);
    
      return (
        <Modal
        closeTimeoutMS={2000}
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Calendario de Objetivos"
            style={customStyles}
        >
            <div className="modal-content">
                <h3>Calendario</h3>
                {sortedGroupedObjectives.map(({ date, objectives }) => (
                    <div key={date}>
                        <h4>{formatNextDayHeader (date)}</h4>
                        <ul>
                            {objectives.map((objective, index) => (
                                <li key={index} className={getObjectiveClassName(objective)}>
                                    <strong>{objective.nombre}</strong> - {objective.descripcion} - {formatDate(objective.fecha)}
                                    {objective.estado === 'pendiente' ? (
                                        <button className="button-350" onClick={() => onToggleObjectiveStatus(objective.id)}>
                                            Marcar como Cumplido
                                        </button>
                                    ) : (
                                        <span className='button-355'>Cumplido</span>
                                    )}
                                    <button className="button-35" onClick={() => onDeleteObjective(objective.id)}>
                                        <img
                                            src="https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/48/delete-icon.png"
                                            alt="Delete Icon"
                                            className="delete-icon"
                                        />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                <button className='button-35' onClick={onClose}>Cerrar</button>
            </div>
        </Modal>
    );
};

// Función para formatear la fecha del encabezado
const formatDateHeader = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('es-ES', options);
};

// Función para formatear la fecha
const formatDate = (date) => new Date(date).toLocaleDateString('es-ES');

// Función para agrupar objetivos por fecha
const groupAndSortObjectivesByDate = (objectives) => {
    const grouped = {};
    objectives.forEach((objective) => {
        const date = objective.fecha.split('T')[0]; // Extrae la fecha sin la parte de la hora
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(objective);
    });

    // Ordenar el array de objetivos por fecha de más antiguo a más nuevo
    const sortedGroupedObjectives = Object.entries(grouped)
        .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
        .map(([date, objectives]) => ({ date, objectives }));

    return sortedGroupedObjectives;
};

const formatNextDayHeader = (date) => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return nextDay.toLocaleDateString('es-ES', options);
};

// Función para obtener la clase CSS según el estado y la fecha
const getObjectiveClassName = (objective) => {
    const currentDate = new Date();
    const objectiveDate = new Date(objective.fecha);

    if (objective.estado === 'pendiente') {
        if (objectiveDate.toDateString() === currentDate.toDateString()) {
            // Objetivo pendiente del día actual en negro y negrita
            return 'current-day-pending';
        } else if (objectiveDate < currentDate) {
            // Objetivo pendiente de días anteriores en rojo y negrita
            return 'past-day-pending';
        }
    } else {
        if (objectiveDate.toDateString() === currentDate.toDateString()) {
            // Objetivo completado del día actual en verde y negrita
            return 'current-day-completed';
        } else if (objectiveDate > currentDate) {
            // Objetivo completado de días futuros en azul y normal
            return 'future-day-completed';
        } else if (objectiveDate < currentDate) {
            // Objetivo pendiente de días anteriores en rojo y negrita
            return 'past-day-completed';
        }
        
    }


    // Por defecto, devolver clase normal
    return '';
};

export default ObjectiveCalendar;