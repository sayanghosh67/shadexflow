const express = require('express');
const router = express.Router();

let state = {
  temperature: 20,
  isRaining: false,
  windowState: 'closed', // 'open' | 'closed'
  mode: 'auto' // 'auto' | 'manual'
};

// GET current status
router.get('/status', (req, res) => {
  res.json(state);
});

// POST open window
router.post('/window/open', (req, res) => {
  if (state.mode === 'auto') {
    state.mode = 'manual'; // Override auto mode
  }
  state.windowState = 'open';
  res.json({ success: true, state });
  req.app.get('io').emit('stateUpdate', state);
});

// POST close window
router.post('/window/close', (req, res) => {
  if (state.mode === 'auto') {
    state.mode = 'manual'; // Override auto mode
  }
  state.windowState = 'closed';
  res.json({ success: true, state });
  req.app.get('io').emit('stateUpdate', state);
});

// POST toggle mode
router.post('/mode', (req, res) => {
  const { mode } = req.body;
  if (mode === 'auto' || mode === 'manual') {
    state.mode = mode;
    // Check auto conditions immediately on switch
    if (mode === 'auto') {
      if (state.isRaining) {
        state.windowState = 'closed';
      } else if (state.temperature > 28) {
        state.windowState = 'open';
      }
    }
  }
  res.json({ success: true, state });
  req.app.get('io').emit('stateUpdate', state);
});

module.exports = { router, getState: () => state, setState: (newState) => { state = { ...state, ...newState }; } };
