const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Branch = sequelize.define('Branch', {
    code: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'branches',
    underscored: true,
    timestamps: false,
});

module.exports = Branch;