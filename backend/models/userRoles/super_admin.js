const sequelize = require('../../config/database.js');
const { DataTypes } = require('sequelize');

const SuperAdmin = sequelize.define('SuperAdmin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
}, {
    tableName: 'super_admins',
    timestamps: true,
    underscored: true,
});

module.exports = SuperAdmin;