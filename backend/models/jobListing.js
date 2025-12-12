const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const { RoleTypes } = require('../config/enums');

const JobListing = sequelize.define('JobListing', {

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
            console.log('Links Array : ' ,linksArr);
            this.setDataValue('webLinks', linksArr.join(','));
        }
    },
    role : {
        type : DataTypes.ENUM(Object.values(RoleTypes)),
        allowNull : 'false'
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
    applicationDeadline: {
        type: DataTypes.DATE,
        allowNull: false
    },
    bondInYrs: {
      type: DataTypes.INTEGER, // in years
        allowNull: false
    },
    locationOptions: {
        type: DataTypes.STRING,
        get() {
            const data =  this.getDataValue('locationOptions');
            return data ? data.toString().split(',') : [];
        },
        set(linksArr) {
            console.log('Links Array  :' , linksArr);
            return this.setDataValue('locationOptions', linksArr.join(','));
        }
      
    },
    ctc: {
        type: DataTypes.INTEGER,
        allowNull : false
    },
    // ctcBreakup: {
        // type: DataTypes.STRING   
    // },  
    ctcBreakup: {
        type: DataTypes.STRING,
        get() {
            const data =  this.getDataValue('ctcBreakup');
            return data ? data.toString().split(',') : [];
        },
        set(linksArr) {
            console.log('Links Array  :' , linksArr);
            return this.setDataValue('ctcBreakup', linksArr.join(','));
        }
      
    },
}, {
    tableName: 'job_listings',
    timestamps: true,
    underscored: true,
});



module.exports = JobListing;
