import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SystemProvider } from './context/SystemContext';
import Dashboard from './components/Dashboard';
import Scene from './components/Scene';

function App() {
  return (
    <SystemProvider>
      <div className="relative w-screen h-screen overflow-hidden bg-[#0b0f19]">
        {/* 3D Background Scene */}
        <div className="absolute inset-0 z-0">
          <Scene />
        </div>

        {/* Floating UI Dashboard overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none flex p-6 md:p-8">
          <Dashboard />
        </div>

        {/* Global Notifications */}
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar theme="dark" />
      </div>
    </SystemProvider>
  );
}

export default App;
