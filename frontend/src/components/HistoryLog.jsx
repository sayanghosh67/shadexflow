import React from 'react';
import { useSystem } from '../context/SystemContext';

export default function HistoryLog() {
  const { logs } = useSystem();

  return (
    <div className="glass-card flex flex-col h-full max-h-64">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-white font-semibold flex items-center">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-2"></span>
          System Event Log
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {logs.length === 0 ? (
          <p className="text-gray-500 text-sm text-center italic mt-4">Waiting for events...</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="flex items-start text-sm">
              <span className="text-gray-500 mr-3 shrink-0 font-mono text-xs mt-0.5">{log.time}</span>
              <span className={`${
                log.type === 'auto' ? 'text-blue-300' : 
                log.type === 'manual' ? 'text-purple-300' : 'text-gray-300'
              }`}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
