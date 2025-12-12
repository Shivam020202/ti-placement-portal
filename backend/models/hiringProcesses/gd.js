const sequelize = require('../../config/database');
const DataTypes = require('sequelize');
const { VenueTypes } = require('../../config/enums');

const GroupDiscussion = sequelize.define('GroupDiscussion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    venue: {
        type: DataTypes.ENUM(Object.values(VenueTypes)),
        allowNull:false
    },
    topic: {
        type: DataTypes.STRING,
        allowNull:true
    },
    link: {
        type: DataTypes.STRING,
        allowNull:true,
        validate: {
            isOnline() {
                if(this.venue !== VenueTypes.ONLINE && this.link !== null) {
                    throw new Error('Link is only allowed for online GDs');
                }
            }
        }
    },
}, {
    tableName: 'group_discussions',
    underscored: true
});

module.exports = GroupDiscussion