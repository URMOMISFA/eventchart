const express = require('express');
const router = express.Router();

// Placeholder user routes
router.get('/', (req, res) => {
  res.json({ success: true, users: [], message: 'Users route is available.' });
});

router.get('/:id', (req, res) => {
  res.json({ success: true, userId: req.params.id, message: 'User detail route is available.' });
});

module.exports = router;
