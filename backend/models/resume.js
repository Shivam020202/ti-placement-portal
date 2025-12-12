const sequelize = require("../config/database");
const { DataTypes } = require('sequelize');

const Resume = sequelize.define('Resume', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },{
    tableName : 'resumes',
    timestamps : true,
    underscored : true
  });

module.exports = Resume;