import React, { useState } from 'react';

export const Tabla = () => {
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

    const generarDiasDelMes = (fecha) => {
        const primerDiaDelMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
        let primerDiaSemana = primerDiaDelMes.getDay(); // 0 para Domingo, 1 para Lunes, etc.
        
        // Ajustar para que el primer día sea miércoles (2)
        primerDiaSemana = (primerDiaSemana + 6) % 7;

        const ultimoDiaDelMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
        const dias = [];

        // Rellenar celdas en blanco para los días anteriores al primer día del mes
        for (let i = 0; i < primerDiaSemana; i++) {
            dias.push({ dia: null });
        }

        // Rellenar celdas con los días del mes
        for (let i = 1; i <= ultimoDiaDelMes.getDate(); i++) {
            dias.push({ dia: i });
        }

        return dias;
    };

    const diasDelMes = generarDiasDelMes(fechaSeleccionada);

    return (
        <div className=''>
            <h2 className='text-center'>Calendario</h2>
            <table>
                <thead>
                    <tr>
                        <th>Lunes</th>
                        <th>Martes</th>
                        <th>Miércoles</th>
                        <th>Jueves</th>
                        <th>Viernes</th>
                        <th>Sábado</th>
                        <th>Domingo</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 6 }, (_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array.from({ length: 7 }, (_, colIndex) => {
                                const index = rowIndex * 7 + colIndex;
                                const dia = diasDelMes[index];
                                return <td className='px-20 pb-20' key={colIndex}>{dia && dia.dia}</td>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Tabla;
