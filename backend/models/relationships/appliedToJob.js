const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const AppliedToJob = sequelize.define('AppliedToJob', {
    coverLetter: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    resume: {
        type: DataTypes.STRING,
        allowNull: false
    },
    personalEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stdCgpa: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    sentToRecruiter : {
        type : DataTypes.BOOLEAN,
        defaultValue : false,
        allowNull : false
    }
}, {
    tableName: 'applied_to_job',
    timestamps: true,
    underscored: true,
});

module.exports = AppliedToJob;