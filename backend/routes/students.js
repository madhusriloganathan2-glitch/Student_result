const express = require('express');
const router = express.Router();

// Get all students
router.get('/', (req, res) => {
  res.json({ success: true, data: [] });
});

// Get student by ID
router.get('/:id', (req, res) => {
  res.json({ success: true, data: {} });
});

// Create student
router.post('/', (req, res) => {
  res.json({ success: true, message: 'Student created' });
});

module.exports = router;
