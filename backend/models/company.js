const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Company = sequelize.define('Company', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique : true
    },
    headOfficeAddress: {
        type: DataTypes.STRING,
    },
    headOfficePhone: {
        type: DataTypes.STRING,
    },
    headOfficeEmail: {
        type: DataTypes.STRING,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    isBlacklisted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    blacklistedReason: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'companies',
    timestamps: true,
    underscored: true,
    validate: {
        checkBlacklistedReason() {
            if (this.isBlacklisted && !this.blacklistedReason) {
                throw new Error('Blacklisted companies must have a reason');
            }
        }
    }
});


module.exports = Company;