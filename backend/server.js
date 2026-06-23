const assessmentRoutes = require('./routes/assessments');
const progressRoutes = require('./routes/progress');
const roadmapRoutes = require('./routes/roadmaps');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize, connectDB } = require('./config/db');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const skillRoutes = require('./routes/skills');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// sync model with DB table
sequelize.sync();

app.get('/', (req, res) => {
  res.send('SkillTrack API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/assessments', assessmentRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});