const sequalize = require('../config/database');
const {DataTypes}=require('sequelize')

const googleToken=sequalize.define('googleToken',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    refreshToken:{
        type:DataTypes.STRING,
        allowNull:false
    },
    accessToken:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    
    tableName:'google_tokens',
    timestamps:true,
    underscored:true
});

module.exports=googleToken;