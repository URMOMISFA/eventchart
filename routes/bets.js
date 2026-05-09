const express = require('express');
const router = express.Router();

// Placeholder bet routes
router.get('/', (req, res) => {
  res.json({ success: true, bets: [], message: 'Bets route is available.' });
});

router.post('/', (req, res) => {
  res.json({ success: true, message: 'Place bet route is available.' });
});

module.exports = router;
