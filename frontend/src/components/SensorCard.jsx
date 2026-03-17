import React from 'react';
import { useSystem } from '../context/SystemContext';
import { Thermometer, CloudRain, Wind } from 'lucide-react';

export default function SensorCard({ title, value, type, active }) {
  const { state } = useSystem();
  
  let Icon = Wind;
  let colorClass = 'text-blue-400';
  let glowStyle = {};

  if (type === 'temperature') {
    Icon = Thermometer;
    colorClass = state.temperature > 28 ? 'text-red-400' : 'text-orange-400';
    if (state.temperature > 28) {
      glowStyle = { boxShadow: '0 0 15px rgba(239,68,68,0.3)' };
    }
  } else if (type === 'rain') {
    Icon = CloudRain;
    colorClass = state.isRaining ? 'text-blue-300' : 'text-gray-400';
    if (state.isRaining) {
      glowStyle = { boxShadow: '0 0 15px rgba(147,197,253,0.3)' };
    }
  } else if (type === 'window') {
    colorClass = state.windowState === 'open' ? 'text-green-400' : 'text-slate-400';
  }

  return (
    <div className="glass-card p-5 flex items-center space-x-4 w-full" style={glowStyle}>
      <div className={`p-3 rounded-xl bg-white/5 ${colorClass}`}>
        <Icon size={28} />
      </div>
      <div>
        <h3 className="text-sm text-gray-400 font-medium tracking-wider uppercase">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
}
