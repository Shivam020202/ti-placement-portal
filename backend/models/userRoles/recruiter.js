const sequelize = require('../../config/database.js');
const { DataTypes } = require('sequelize');

const Recruiter = sequelize.define('Recruiter', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

}, {
    //TODO: Change to recruiters
    tableName: 'recruiter',
    timestamps: true,
    underscored: true
});

module.exports = Recruiter;