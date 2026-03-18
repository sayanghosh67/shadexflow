const express = require('express');
const router = express.Router();

let state = {
  temperature: 20,
  isRaining: false,
  windowState: 'closed', // 'open' | 'closed'
  mode: 'auto', // 'auto' | 'manual'
  autoOpenTemp: 28 // user-configurable threshold
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

// POST settings (autoOpenTemp)
router.post('/settings', (req, res) => {
  const { autoOpenTemp } = req.body;
  if (typeof autoOpenTemp === 'number') {
    state.autoOpenTemp = autoOpenTemp;

    // Trigger auto logic immediately check on threshold change
    if (state.mode === 'auto') {
      if (state.isRaining && state.windowState !== 'closed') {
        state.windowState = 'closed';
      } else if (!state.isRaining && state.temperature > state.autoOpenTemp && state.windowState !== 'open') {
        state.windowState = 'open';
      } else if (!state.isRaining && state.temperature <= state.autoOpenTemp && state.windowState !== 'closed') {
        state.windowState = 'closed';
      }
    }
  }
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
      } else if (state.temperature > state.autoOpenTemp) {
        state.windowState = 'open';
      } else if (state.temperature <= state.autoOpenTemp) {
        state.windowState = 'closed';
      }
    }
  }
  res.json({ success: true, state });
  req.app.get('io').emit('stateUpdate', state);
});

// POST current weather
router.post('/weather', (req, res) => {
  const { isRaining, temperature } = req.body;
  if (typeof isRaining === 'boolean') state.isRaining = isRaining;
  if (typeof temperature === 'number') state.temperature = temperature;

  // Immediately check auto logic
  if (state.mode === 'auto') {
    if (state.isRaining && state.windowState !== 'closed') {
      state.windowState = 'closed';
    } else if (!state.isRaining && state.temperature > state.autoOpenTemp && state.windowState !== 'open') {
      state.windowState = 'open';
    } else if (!state.isRaining && state.temperature <= state.autoOpenTemp && state.windowState !== 'closed') {
      state.windowState = 'closed';
    }
  }
  
  res.json({ success: true, state });
  req.app.get('io').emit('stateUpdate', state);
});

module.exports = { router, getState: () => state, setState: (newState) => { state = { ...state, ...newState }; } };
