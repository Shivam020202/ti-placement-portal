const sequelize = require('../../config/database.js');
const {Programs, Courses, ScoreTypes} = require('../../config/enums.js');
const { DataTypes } = require('sequelize');

const Student = sequelize.define('Student', {
    rollNumber: {
        type: DataTypes.STRING,
        primaryKey: true,
        validate: {
            isNumeric: true,
            len: [9,9]
        }
    },
    gradYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            len: [4,4]
        }
    },
    program: {
        type: DataTypes.ENUM(Object.values(Programs)),
        allowNull: false,
    },
    course: {
        type: DataTypes.ENUM(Object.values(Courses)),
        allowNull: false,
    },
    cgpa : {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 10
        }
    },
    subjectsFailed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    class10ScoreType: {
        type: DataTypes.ENUM(Object.values(ScoreTypes)),
        allowNull: false,
    },
    class10Score: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    class10Board: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    class12ScoreType: {
        type: DataTypes.ENUM(Object.values(ScoreTypes)),
    },
    class12Score: {
        type: DataTypes.FLOAT,
    },
    class12Board: {
        type: DataTypes.STRING,
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    diplomaScoreType: {
        type: DataTypes.ENUM(Object.values(ScoreTypes)),
    },
    diplomaScore: {
        type: DataTypes.FLOAT,
    },
    diplomaGradYear: {
        type: DataTypes.INTEGER,
        validate: {
            len: [4,4]
        }
    },
    isPlaced: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isSpr: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isSic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    tableName: 'students',
    timestamps: true,
    underscored: true,
    validate: {
        validateClass10Score() {
            if (this.class10ScoreType == ScoreTypes.PERCENTAGE && (this.class10Score < 0 || this.class10Score > 100)) {
                throw new Error('Class 10 Percentage should be between 0 and 100');
            }
            if (this.class10ScoreType == ScoreTypes.CGPA && (this.class10Score < 0 || this.class10Score > 10)) {
                throw new Error('Class 10 CGPA should be between 0 and 10');
            }
        },
        validateClass12Score() {
            if (this.class12ScoreType == ScoreTypes.PERCENTAGE && (this.class12Score < 0 || this.class12Score > 100)) {
                throw new Error('Class 12 Percentage should be between 0 and 100');
            }
            if (this.class12ScoreType == ScoreTypes.CGPA && (this.class12Score < 0 || this.class12Score > 10)) {
                throw new Error('Class 12 CGPA should be between 0 and 10');
            }
        }
    },
    
}, 
);

module.exports = Student;