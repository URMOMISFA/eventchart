const express = require('express');
const router = express.Router();

// Placeholder auth routes
router.post('/login', (req, res) => {
  res.json({ success: true, message: 'Login route is available.' });
});

router.post('/register', (req, res) => {
  res.json({ success: true, message: 'Register route is available.' });
});

router.get('/me', (req, res) => {
  res.json({ success: true, user: null, message: 'User profile route is available.' });
});

module.exports = router;
