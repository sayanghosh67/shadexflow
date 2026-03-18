import React from 'react';
import { useSystem } from '../context/SystemContext';
import SensorCard from './SensorCard';
import Controls from './Controls';
import HistoryLog from './HistoryLog';
import WeatherMap from './WeatherMap';

export default function Dashboard() {
  const { state } = useSystem();

  return (
    <div className="flex flex-col md:flex-row w-full min-h-full gap-4 md:gap-6 max-w-[1400px] mx-auto items-stretch pointer-events-none justify-between">
      
      {/* Left Sidebar (Sensors & Controls) */}
      <div className="w-full md:w-96 flex flex-col space-y-4 md:space-y-6 pointer-events-auto shrink-0 md:self-start">
        <div className="mb-0 md:mb-2 bg-gray-900/60 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none backdrop-blur-md md:backdrop-blur-none border border-white/5 md:border-none">
          <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tight">
            ShadeXFlow
          </h1>
          <p className="text-gray-400 text-xs md:text-sm mt-1">IoT 3D Real-Time Dashboard</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
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
      <div className="w-full md:w-80 flex flex-col justify-end space-y-4 md:space-y-6 pointer-events-auto shrink-0 md:self-end mt-2 md:mt-0 pb-10 md:pb-0">
        <WeatherMap />
        <HistoryLog />
      </div>

    </div>
  );
}
