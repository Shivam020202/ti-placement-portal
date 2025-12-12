const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const IntermediateJob = sequelize.define('IntermediateJob', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    requirements: {
        type: DataTypes.STRING,
        allowNull: false
    },
    responsibilities: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descriptionText: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    descriptionFile: {
        type: DataTypes.STRING, // need to store file
        allowNull: false
    },
    webLinks: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            const data =  this.getDataValue('webLinks'); ;
            return data ? data.toString().split(',') : [];
        },
        set(linksArr) {
            this.setDataValue('webLinks', linksArr.join(','));
        }
    },
    gradYear: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            const data =  this.getDataValue('gradYear');
            return data ? data.toString().split(',') : [];
        },
        set(arr) {
            console.log(arr);
            console.log(arr.join(','));
            return this.setDataValue('gradYear', arr.join(','));
        }
    },
    failedSubjects: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    activeBacklogsAcceptable: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    assesmentRounds: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    interviewRounds: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    applicationDeadline: {
        type: DataTypes.DATE,
        allowNull: false
    },
    bondInYrs: {
        type: DataTypes.DATE, // in years
        allowNull: false
    },
    remoteWork: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    locationOptions: {
        type: DataTypes.STRING,
        get() {
            const data =  this.getDataValue('locationOptions');
            return data ? data.toString().split(',') : [];
        },
        set(linksArr) {
            return this.setDataValue('locationOptions', linksArr.join(','));
        }
    },
    ctc: {
        type: DataTypes.INTEGER
    },
    ctcBreakup: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'intermediate_job',
    timestamps: true,
    underscored: true,
});



module.exports = IntermediateJob;