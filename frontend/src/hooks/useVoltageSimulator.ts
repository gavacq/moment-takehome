import { useState, useEffect, useRef } from 'react';
import { postMeasurement } from '../lib/api';

export function useVoltageSimulator(initialVoltage: number = 5.0) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentVoltage, setCurrentVoltage] = useState(initialVoltage);
  const intervalRef = useRef<any>(null);

  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isSimulating) {
      intervalRef.current = setInterval(async () => {
        setCurrentVoltage((prev) => {
          const nextVoltage = Math.max(0, prev - 0.01);
          
          if (nextVoltage === 0) {
            stopSimulation();
          }
          
          // Post the measurement
          postMeasurement(Number(nextVoltage.toFixed(2)), new Date())
            .catch((err) => console.error('Simulation post failed:', err));
            
          return nextVoltage;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSimulating]);

  return {
    isSimulating,
    currentVoltage,
    startSimulation,
    stopSimulation,
  };
}
