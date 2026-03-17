import React from 'react';
import { useSystem } from '../context/SystemContext';

export default function Controls() {
  const { state, toggleMode, openWindow, closeWindow } = useSystem();

  return (
    <div className="glass-card p-6 flex flex-col space-y-6">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-lg">System Mode</h3>
          <p className="text-xs text-gray-400">Automatic vs Manual Control</p>
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

      {/* Manual Window Controls */}
      <div className="flex space-x-4">
        <button 
          onClick={openWindow}
          className={`flex-1 py-3 px-4 rounded-xl border border-white/10 font-bold tracking-wide transition-all ${state.windowState === 'open' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'}`}
        >
          OPEN WINDOW
        </button>
        <button 
          onClick={closeWindow}
          className={`flex-1 py-3 px-4 rounded-xl border border-white/10 font-bold tracking-wide transition-all ${state.windowState === 'closed' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'}`}
        >
          CLOSE WINDOW
        </button>
      </div>
    </div>
  );
}
