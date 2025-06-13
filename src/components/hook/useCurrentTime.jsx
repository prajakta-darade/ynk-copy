// src/hooks/useCurrentTime.js
import { useState, useEffect } from 'react';

const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (language) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    };

    if (language === 'mr') {
      return `दिनांक: ${currentTime.toLocaleDateString('mr-IN', options).replace('AM', 'सकाळी').replace('PM', 'दुपारी')}`;
    }
    return `Date: ${currentTime.toLocaleString('en-US', options).replace(',', '')} IST`;
  };

  return { currentTime, formatDateTime };
};

export default useCurrentTime;