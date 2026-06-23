const express = require('express');
const Progress = require('../models/Progress');

const router = express.Router();

// Mark topic as completed (or create progress entry)
router.post('/', async (req, res) => {
  try {
    const { user_id, topic_id, completed } = req.body;

    const existing = await Progress.findOne({ where: { user_id, topic_id } });

    if (existing) {
      existing.completed = completed;
      await existing.save();
      return res.status(200).json(existing);
    }

    const progress = await Progress.create({ user_id, topic_id, completed });
    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all progress for a user
router.get('/:userId', async (req, res) => {
  try {
    const records = await Progress.findAll({ where: { user_id: req.params.userId } });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;