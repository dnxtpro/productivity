// NavBar.js

import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/daily-summary">Resumen Diario</Link></li>
        <li><Link to="/objective-manager">Gestión de Objetivos</Link></li>
        {/* Otros enlaces según tu aplicación */}
      </ul>
    </nav>
  );
};

export default NavBar;
