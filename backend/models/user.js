const sequelize = require('../config/database.js');
const {UserRoles} = require('../config/enums.js');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    lastName: {
        type: DataTypes.STRING
    },
    fullName: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.firstName} ${this.lastName}`;
        },
        set(_) {
            throw new Error('Do not try to set the `fullName` value!');
        }
    },
    role: {
        type: DataTypes.ENUM(Object.values(UserRoles)),
        allowNull: false,
    }
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true
});

module.exports = User;
