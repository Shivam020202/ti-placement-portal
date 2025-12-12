const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const { StatusTypes } = require('../config/enums');

const ListingReview = sequelize.define('ListingReview', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.ENUM(Object.values(StatusTypes)),
        allowNull: false
    },
    statusReason: {
        type: DataTypes.STRING,
    },
    chatRef: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'listing_reviews',
    timestamps: true,
    underscored: true,
    validate: {
        checkStatusReason() {
            if (this.status === StatusTypes.REJECTED && !this.statusReason) {
                throw new Error('Rejected reviews must have a reason');
            }
        }
    }
});

module.exports = ListingReview;