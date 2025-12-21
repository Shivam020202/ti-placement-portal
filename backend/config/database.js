// Database configuration and connection happens here
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// SSL configuration for Aiven or other cloud databases
const sslConfig =
  process.env.DB_SSL === "true"
    ? {
        ssl: {
          require: true,
          rejectUnauthorized:
            process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
          // If you have a CA certificate file, specify its path in DB_CA_CERT
          ...(process.env.DB_CA_CERT && {
            ca: fs.readFileSync(path.resolve(process.env.DB_CA_CERT)),
          }),
        },
      }
    : {};

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dialectOptions: {
    ...sslConfig,
    // Additional MySQL options
    connectTimeout: 60000,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  logging: process.env.NODE_ENV === "development" ? console.log : false,
});

module.exports = sequelize;
