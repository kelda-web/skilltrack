const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Skill = require('./Skill');

const Roadmap = sequelize.define('Roadmap', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  skill_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  topic_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resource_link: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'roadmaps',
  timestamps: false,
});

Roadmap.belongsTo(Skill, { foreignKey: 'skill_id' });

module.exports = Roadmap;