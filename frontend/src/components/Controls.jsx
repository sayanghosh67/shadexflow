import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';

export default function Controls() {
  const { state, toggleMode, openWindow, closeWindow, updateWeather, updateSettings } = useSystem();
  
  // Use local state for the input to prevent janky typing when network latency occurs
  const [threshold, setThreshold] = useState(state.autoOpenTemp || 28);

  const submitThreshold = () => {
    const val = Number(threshold);
    if (!isNaN(val)) updateSettings(val);
  };

  return (
    <div className="glass-card p-6 flex flex-col space-y-5">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-lg">System Mode</h3>
          <p className="text-xs text-gray-400 mt-1">Automatic vs Manual Control</p>
        </div>
        
        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
          <button 
            onClick={() => toggleMode('auto')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${state.mode === 'auto' ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'text-gray-400 hover:text-white'}`}
          >
            Auto
          </button>
          <button 
            onClick={() => toggleMode('manual')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${state.mode === 'manual' ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)]' : 'text-gray-400 hover:text-white'}`}
          >
            Manual
          </button>
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Auto-Open Threshold Setting */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">Auto-Open Threshold</h3>
          <p className="text-xs text-gray-400 mt-1">Temperature that triggers window</p>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            value={threshold} 
            onChange={(e) => setThreshold(e.target.value)}
            onBlur={submitThreshold}
            onKeyDown={(e) => { if (e.key === 'Enter') submitThreshold(); }}
            className="w-16 bg-black/40 text-white px-2 py-2 rounded-lg border border-white/10 text-center text-sm font-medium focus:outline-none focus:border-blue-500"
          />
          <span className="text-gray-400 font-medium">°C</span>
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Weather Override Toggle */}
      <div>
        <h3 className="text-white font-semibold">Weather Override</h3>
        <p className="text-xs text-gray-400 mb-3 mt-1">Simulate conditions (Heat / Clear / Rain)</p>
        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 w-full">
          <button 
            onClick={() => updateWeather(35, false)} 
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-300 ${!state.isRaining && state.temperature > (state.autoOpenTemp || 28) ? 'bg-orange-600 text-white shadow-[0_0_10px_rgba(234,88,12,0.5)]' : 'text-gray-400 hover:text-white'}`}
          >
            Heat
          </button>
          <button 
            onClick={() => updateWeather(25, false)} 
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-300 ${!state.isRaining && state.temperature <= (state.autoOpenTemp || 28) ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'text-gray-400 hover:text-white'}`}
          >
            Clear
          </button>
          <button 
            onClick={() => updateWeather(20, true)} 
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-300 ${state.isRaining ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'text-gray-400 hover:text-white'}`}
          >
            Rain
          </button>
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Manual Window Controls */}
      <div className="flex space-x-4">
        <button 
          onClick={openWindow}
          className={`flex-1 py-3 px-4 rounded-xl border border-white/10 font-bold tracking-wide transition-all ${state.windowState === 'open' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'}`}
        >
          OPEN
        </button>
        <button 
          onClick={closeWindow}
          className={`flex-1 py-3 px-4 rounded-xl border border-white/10 font-bold tracking-wide transition-all ${state.windowState === 'closed' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'}`}
        >
          CLOSE
        </button>
      </div>
    </div>
  );
}
