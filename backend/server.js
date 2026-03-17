const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { router, getState, setState } = require('./routes/api');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Attach io to app to emit from routes
app.set('io', io);

// API Routes
app.use('/api', router);

// WebSocket connections
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  // Send current state on connection
  socket.emit('stateUpdate', getState());

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Hardware / Sensor Simulation Loop
setInterval(() => {
  let state = getState();
  let changed = false;

  // Simulate random temperature changes between 15C and 35C
  const tempChange = (Math.random() - 0.5) * 2; // -1 to +1
  let newTemp = state.temperature + tempChange;
  newTemp = Math.max(15, Math.min(35, newTemp));
  
  if (Math.abs(state.temperature - newTemp) > 0.5) {
    state.temperature = parseFloat(newTemp.toFixed(1));
    changed = true;
  }

  // Simulate random rain changes (5% chance to toggle state every 3 seconds)
  if (Math.random() < 0.05) {
    state.isRaining = !state.isRaining;
    changed = true;
  }

  // Automatic Window Control Logic
  if (state.mode === 'auto') {
    if (state.isRaining && state.windowState !== 'closed') {
      state.windowState = 'closed';
      changed = true;
    } else if (!state.isRaining && state.temperature > 28 && state.windowState !== 'open') {
      state.windowState = 'open';
      changed = true;
    } else if (!state.isRaining && state.temperature <= 28 && state.windowState !== 'closed') {
      state.windowState = 'closed';
      changed = true;
    }
  }

  if (changed) {
    setState(state);
    io.emit('stateUpdate', getState());
  }
}, 3000); // Run simulation every 3 seconds

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
