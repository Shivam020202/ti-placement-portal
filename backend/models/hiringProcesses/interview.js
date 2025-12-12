const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');
const { InterviewTypes, VenueTypes } = require('../../config/enums');


const Interview = sequelize.define('Interview', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    venue: {
        type: DataTypes.ENUM(Object.values(VenueTypes)),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM(Object.values(InterviewTypes)),
        allowNull: false
    },
    link: {
        type: DataTypes.STRING,
        allowNull:true,
        validate: {
            isOnline() {
                if(this.venue !== VenueTypes.ONLINE && this.link !== null) {
                    throw new Error('Link is only allowed for online Interviews');
                }
            }
        }
    },
}, {
    tableName: 'interviews',
    underscored: true
});

module.exports = Interview