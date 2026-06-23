const express = require('express');
const Skill = require('../models/Skill');

const router = express.Router();

// GET all skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.findAll();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST add a new skill (admin use, or initial seeding)
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const skill = await Skill.create({ name, description });
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;