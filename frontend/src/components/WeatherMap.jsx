import React, { useEffect, useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { MapPin, CloudRain, Sun } from 'lucide-react';

export default function WeatherMap() {
  const { state, updateWeather } = useSystem();
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get user location
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLocation({ lat, lon });

        try {
          // 2. Fetch from Open-Meteo
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,rain,precipitation`
          );
          if (!res.ok) throw new Error("Weather fetch failed");
          const data = await res.json();
          
          if (data && data.current) {
            const temp = data.current.temperature_2m;
            let isRaining = data.current.precipitation > 0 || data.current.rain > 0;
            
            // 3. Update backend immediately (frontend state will follow from socket)
            updateWeather(temp, isRaining);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(`Location error: ${err.message}`);
        setLoading(false);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-xl overflow-hidden pointer-events-auto">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="text-blue-400 w-5 h-5" />
        <h2 className="text-white font-semibold flex-1">Real-time Weather & Map</h2>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm mb-4">
          Detecting location...
        </div>
      ) : error ? (
        <div className="h-48 flex items-center justify-center text-red-400 text-sm px-4 text-center mb-4">
          {error}
        </div>
      ) : location ? (
        <div className="h-40 rounded-xl overflow-hidden border border-white/5 bg-gray-900 mb-4">
          {/* Embedded OpenStreetMap Standard fallback */}
          <iframe
            title="Location Map"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lon - 0.05}%2C${location.lat - 0.05}%2C${location.lon + 0.05}%2C${location.lat + 0.05}&layer=mapnik&marker=${location.lat}%2C${location.lon}`}
          ></iframe>
        </div>
      ) : null}

      <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-xl border border-white/5 mt-auto">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">{state.temperature}°C</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          {state.isRaining ? (
            <span className="flex items-center gap-1 text-blue-400">
              <CloudRain className="w-4 h-4" /> Raining
            </span>
          ) : (
            <span className="flex items-center gap-1 text-yellow-400">
              <Sun className="w-4 h-4" /> Clear
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
