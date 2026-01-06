const express = require('express');
const router = express.Router();

// Get all teachers
router.get('/', (req, res) => {
  res.json({ success: true, data: [] });
});

// Get teacher by ID
router.get('/:id', (req, res) => {
  res.json({ success: true, data: {} });
});

module.exports = router;
