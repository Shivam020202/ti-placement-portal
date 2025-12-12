const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const { SkillCategories } = require('../config/enums');

const Skill = sequelize.define('Skill', {
    name: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    category: {
        type: DataTypes.ENUM(Object.values(SkillCategories)),
        allowNull: false,
    }
}, {
    tableName: 'skills',
    underscored: true,
});

module.exports = Skill;