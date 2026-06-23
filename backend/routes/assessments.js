const express = require('express');
const Assessment = require('../models/Assessment');

const router = express.Router();

// Submit assessment score, auto calculate level
router.post('/', async (req, res) => {
  try {
    const { user_id, skill_id, score } = req.body;

    let level = 'Beginner';
    if (score >= 80) level = 'Advanced';
    else if (score >= 50) level = 'Intermediate';

    const assessment = await Assessment.create({ user_id, skill_id, score, level });
    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's assessment results
router.get('/:userId', async (req, res) => {
  try {
    const results = await Assessment.findAll({ where: { user_id: req.params.userId } });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;