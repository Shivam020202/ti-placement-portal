// Associating all the middlewares in arrays
// Only import and use middlewares from this file

const isSuperAdmin = require("./isSuperAdmin");
const isAdmin = require("./isAdmin");
const isStudent = require("./isStudent");
const isRecuiter = require('./isRecruiter');
const isAdminOrSuperAdminOrRecruiter = require("./isAdminOrSuperAdminOrRecruiter");
const error = require("./error");
const userExists = require("./userExists");
const isAdminOrSuperAdmin = require("./isAdminOrSuperAdmin");


module.exports = {
    isSuperAdmin,
    isAdmin,
    isAdminOrSuperAdminOrRecruiter,
    isAdminOrSuperAdmin,
    isRecuiter,
    isStudent,
    error,
    userExists
}