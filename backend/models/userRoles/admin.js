const sequelize = require('../../config/database.js');
const { DataTypes } = require('sequelize');

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
}, {
    tableName: 'admins',
    timestamps: true,
    underscored: true,
});

module.exports = Admin;