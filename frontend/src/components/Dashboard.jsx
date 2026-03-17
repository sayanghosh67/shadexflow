import React from 'react';
import { useSystem } from '../context/SystemContext';
import SensorCard from './SensorCard';
import Controls from './Controls';
import HistoryLog from './HistoryLog';

export default function Dashboard() {
  const { state } = useSystem();

  return (
    <div className="flex flex-col md:flex-row w-full gap-6 max-w-7xl mx-auto items-end md:items-stretch pointer-events-none">
      
      {/* Left Sidebar (Sensors & Controls) */}
      <div className="w-full md:w-96 flex flex-col space-y-6 pointer-events-auto">
        <div className="mb-2">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tight">
            ShadeXFlow
          </h1>
          <p className="text-gray-400 text-sm mt-1">IoT 3D Real-Time Dashboard</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <SensorCard 
            title="Temperature" 
            value={`${state.temperature}°C`} 
            type="temperature"
          />
          <SensorCard 
            title="Rain Monitor" 
            value={state.isRaining ? "Raining" : "Clear"} 
            type="rain"
          />
          <SensorCard 
            title="Window State" 
            value={state.windowState === 'open' ? 'Open' : 'Closed'} 
            type="window"
            className="col-span-2 lg:col-span-1"
          />
        </div>

        <Controls />
      </div>

      {/* Spacer to push right sidebar */}
      <div className="flex-1 hidden md:block"></div>

      {/* Right Sidebar (Logs & Analytics placeholder) */}
      <div className="w-full md:w-80 flex flex-col justify-end pointer-events-auto">
        <HistoryLog />
      </div>

    </div>
  );
}
