import React, { useState, useEffect } from 'react';

const Timer = ({ isRunning }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) {
      setSeconds(0);
    }
  }, [isRunning]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="text-blue-300 text-4xl fuenteperso">
      <h3>TIEMPO: {String(minutes).padStart(2, '0')}:{String(remainingSeconds).padStart(2, '0')}</h3>
    </div>
  );
};

export default Timer;