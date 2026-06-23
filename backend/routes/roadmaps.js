const express = require('express');
const Roadmap = require('../models/Roadmap');

const router = express.Router();

// GET all topics for a specific skill
router.get('/:skillId', async (req, res) => {
  try {
    const topics = await Roadmap.findAll({
      where: { skill_id: req.params.skillId },
    });
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST add a topic to a skill
router.post('/', async (req, res) => {
  try {
    const { skill_id, topic_name, resource_link } = req.body;
    const topic = await Roadmap.create({ skill_id, topic_name, resource_link });
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;