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

// Sensor Loop (Auto checks)
setInterval(() => {
  let state = getState();
  let changed = false;

  // Automatic Window Control Logic
  if (state.mode === 'auto') {
    if (state.isRaining && state.windowState !== 'closed') {
      state.windowState = 'closed';
      changed = true;
    } else if (!state.isRaining && state.temperature > state.autoOpenTemp && state.windowState !== 'open') {
      state.windowState = 'open';
      changed = true;
    } else if (!state.isRaining && state.temperature <= state.autoOpenTemp && state.windowState !== 'closed') {
      state.windowState = 'closed';
      changed = true;
    }
  }

  if (changed) {
    setState(state);
    io.emit('stateUpdate', getState());
  }
}, 3000); // Run check every 3 seconds

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
