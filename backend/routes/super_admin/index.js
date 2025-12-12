// Only put routes here that are accessible JUST to the super admin
// Every route that is accessible both to the super admin and the admin should be put in the admin/ directory

const router = require('express').Router();

const inviteRouter = require('./invite.js');
router.use('/invite', inviteRouter);

const branchRouter = require('./branch.js');
router.use('/branch', branchRouter);

const adminRouter = require('./admin.js');
router.use('/admin', adminRouter);

const recruiterRouter = require('./recruiter.js');
router.use('/recruiter' , recruiterRouter);

const studentRouter = require('./student.js');
router.use('/student', studentRouter);

const companyRouter = require('../admin/company'); // Import the company router
router.use('/company', companyRouter); // Add company routes

router.use('/', (req, res) => {
    res.send('Hello , Welcome to the super admin API');
})

module.exports = router;