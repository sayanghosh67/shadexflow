import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const SystemContext = createContext();
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://shadexflow-backend.onrender.com';

export const SystemProvider = ({ children }) => {
  const [state, setState] = useState({
    temperature: 20,
    isRaining: false,
    windowState: 'closed',
    mode: 'auto'
  });
  
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const socket = io(BACKEND_URL);

    socket.on('stateUpdate', (newState) => {
      setState((prevState) => {
        // Notification logic for automatic changes
        if (prevState.mode === 'auto' && newState.mode === 'auto') {
          if (prevState.windowState !== newState.windowState) {
            const actionText = newState.windowState === 'open' ? 'opened' : 'closed';
            const reason = newState.windowState === 'open' ? 'High Temperature' : 'Rain Detected';
            const message = `Window automatically ${actionText} (${reason})`;
            
            toast.info(message, { theme: 'dark' });
            
            setLogs(prev => [{
              time: new Date().toLocaleTimeString(),
              message,
              type: 'auto'
            }, ...prev].slice(0, 10)); // keep last 10
          }
        }
        return newState;
      });
    });

    return () => socket.disconnect();
  }, []);

  const openWindow = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/window/open`, { method: 'POST' });
      const data = await res.json();
      setState(data.state);
      setLogs(prev => [{ time: new Date().toLocaleTimeString(), message: 'Window manually opened', type: 'manual' }, ...prev].slice(0, 10));
    } catch (err) {
      toast.error('Failed to open window');
    }
  };

  const closeWindow = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/window/close`, { method: 'POST' });
      const data = await res.json();
      setState(data.state);
      setLogs(prev => [{ time: new Date().toLocaleTimeString(), message: 'Window manually closed', type: 'manual' }, ...prev].slice(0, 10));
    } catch (err) {
      toast.error('Failed to close window');
    }
  };

  const toggleMode = async (mode) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/mode`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })
      });
      const data = await res.json();
      setState(data.state);
      setLogs(prev => [{ time: new Date().toLocaleTimeString(), message: `Switched to ${mode} mode`, type: 'system' }, ...prev].slice(0, 10));
    } catch (err) {
      toast.error('Failed to toggle mode');
    }
  };

  return (
    <SystemContext.Provider value={{ state, logs, openWindow, closeWindow, toggleMode }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => useContext(SystemContext);
