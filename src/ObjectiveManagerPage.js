import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'; // Agrega esta importación
import ObjectiveForm from './ObjectiveForm';
import ObjectiveCalendar from './ObjectiveCalendar';
import Modal from 'react-modal';
import './Calendar.css';
import Tabla from './tabla.js';
import EventCalendar from './components/EventCalendar.tsx'

import Calendar from 'react-calendar'

const ObjectiveManagerPage = () => {
 return (
  <div className="flex w-full h-full op-0 right-0 bottom-0 left-0 z-[-2] transform top-0  bg-rose-950 mb-0 bg-gradient-to-r from-purple-500 to-pink-500">
     <EventCalendar/>
    </div>
  );
};

export default ObjectiveManagerPage;