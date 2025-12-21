const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Resume = sequelize.define(
  "Resume",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Store the original filename
    originalName: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null for backward compatibility with old resumes
    },
    // Store the file's MIME type
    mimeType: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null for backward compatibility
      defaultValue: "application/pdf",
    },
    // Store the file content as BLOB (MEDIUMBLOB for files up to 16MB)
    fileData: {
      type: DataTypes.BLOB("medium"),
      allowNull: true, // Allow null for backward compatibility (old resumes have url instead)
    },
    // Store file size in bytes for validation
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow null for backward compatibility
    },
    // Keep the old url field for backward compatibility with existing resumes
    url: {
      type: DataTypes.STRING,
      allowNull: true, // Now optional - old resumes have this, new ones don't
    },
  },
  {
    tableName: "resumes",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Resume;
