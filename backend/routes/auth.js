const express = require('express');
const router = express.Router();

// Login route
router.post('/login', (req, res) => {
  res.json({ success: true, message: 'Login endpoint' });
});

// Register route
router.post('/register', (req, res) => {
  res.json({ success: true, message: 'Register endpoint' });
});

module.exports = router;
