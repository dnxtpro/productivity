import React, { useState } from 'react';
import Modal from 'react-modal'; // Importa react-modal

const ObjectiveForm = ({ onAddObjective, nameOptions, isOpen, onClose }) => {
  const [newObjective, setNewObjective] = useState({
    nombre: '',
    descripcion: '',
    fecha: '',
    estado: 'pendiente',
  });
  const customStyles = {
    content: {
      width: '50%', // Ajusta el ancho según tus preferencias
      height: '40%', // Ajusta la altura según tus preferencias
      top: '50%', // Centra verticalmente
      left: '50%', // Centra horizontalmente
      transform: 'translate(-50%, -50%)', // Centra completamente
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdrop:'blur', // Fondo semitransparente
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        cursor: 'pointer',
      },
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewObjective({ ...newObjective, [name]: value });
  };

  const handleAddObjective = () => {
    onAddObjective(newObjective);
    setNewObjective({ nombre: '', descripcion: '', fecha: '', estado: 'pendiente'});    
    onClose();
  };
  const handleClose = () => {
    onClose();
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Agregar Nuevo Objetivo"
      style={customStyles}
    >
      <div style={customStyles.closeButton} onClick={handleClose}>
        X
      </div>
      <div className="flex flex-col gap-2 px-auto">
        <div className="flex flex-col align-middle items-center">
          <div className="flex flex-row font-bold">
            <label htmlFor="nombre" className="label">Nombre:</label>
            <select
              id="nombre"
              name="nombre"
              value={newObjective.nombre}
              onChange={handleInputChange}
              className="input1"
            >
              <option value="" disabled>Seleccione un nombre...</option>
              {nameOptions.map((name) => (
                <option key={name.id} value={name.nombre}>{name.nombre}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-row font-bold">
            <label htmlFor="descripcion" className="label">Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={newObjective.descripcion}
              onChange={handleInputChange}
              className="input1"
            ></textarea>
          </div>
          <div className="flex flex-row font-bold">
            <label htmlFor="fecha" className="label">Fecha:</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={newObjective.fecha}
              onChange={handleInputChange}
              className="input1"
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button className='font-bold text-3xl p-3 rounded-lg bg-pink-300  ' onClick={handleAddObjective}>Agregar Objetivo</button>
        </div>
      </div>
    </Modal>
  );
};

export default ObjectiveForm;