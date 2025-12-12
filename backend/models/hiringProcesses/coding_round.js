const sequelize = require('../../config/database.js');
const { DataTypes } = require('sequelize');
const { VenueTypes } = require('../../config/enums');

const CodingRound = sequelize.define('CodingRound', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    venue: {
        type: DataTypes.ENUM(Object.values(VenueTypes)),
        allowNull:false
    },
    link: {
        type: DataTypes.STRING,
        allowNull:true
    },
}, {
    tableName: 'coding_rounds',
    underscored: true
});

module.exports = CodingRound