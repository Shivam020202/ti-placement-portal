const sequelize = require('../../config/database')
const { DataTypes } = require('sequelize');
const { HiringProcesses } = require('../../config/enums');

const HiringProcess = sequelize.define('HiringProcess', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    index: {
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    type: {
        type: DataTypes.ENUM(Object.values(HiringProcesses)),
        allowNull:true
    },
    title: {
        type: DataTypes.STRING,
        allowNull:true
    },
    startDateTime: {
        type: DataTypes.DATE,
        allowNull:true
    },
    endDateTime: {
        type: DataTypes.DATE,
        allowNull:true
    }
}, {
    tableName: 'hiring_processes',
    underscored: true
});

module.exports = HiringProcess