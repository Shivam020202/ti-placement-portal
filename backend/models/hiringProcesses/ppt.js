const sequelize = require('../../config/database');
const DataTypes = require('sequelize');
const { VenueTypes } = require('../../config/enums');

const PPT = sequelize.define('PPT', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    venue: {
        type: DataTypes.ENUM(Object.values(VenueTypes)),
        allowNull: false
    }, 
    link: {
        type: DataTypes.STRING,
        allowNull:true,
        validate: {
            isOnline() {
                if(this.venue !== VenueTypes.ONLINE && this.link !== null) {
                    throw new Error('Link is only allowed for online PPTs');
                }
            }
        }
    },
}, {
    tableName: 'ppts',
    underscored: true
});

module.exports = PPT;