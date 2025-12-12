const express = require("express");
const studentRouter = require("./students");
const adminRouter = require("./admins");
const recruiterRouter = require("./recruiters");
const middlewares = require("../../middlewares");
const router = express.Router();

router.use('/students' , middlewares.isStudent , studentRouter);

// TODO: router.use('/:jobId/admins/' , middlewares.fetchJob, middlewares.isAdminOrSuperAdmin , adminRouter);

router.use('/admins', middlewares.isAdminOrSuperAdmin , adminRouter);

router.use('/recruiters' , middlewares.isRecuiter , recruiterRouter);

module.exports = router;