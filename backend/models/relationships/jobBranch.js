const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const JobBranch = sequelize.define('JobBranch', {
    minCgpa: {
        type: DataTypes.FLOAT,
        allowNull : false
    }
}, {
    tableName: 'job_branch',
    timestamps: true,
    underscored: true,
});

module.exports = JobBranch;