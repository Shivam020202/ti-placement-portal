const router = require('express').Router();

// Router imports
const userRouter = require('./user.js')
const studentRouter = require('./student/');
const adminRouter = require('./admin/');
const superAdminRouter = require('./super_admin/');
const recruiterRouter = require('./recruiter');
const loginRouter = require('./login.js');
const jobListingRouter = require('./jobListings');
const hiringProcessRouter = require('./hiring_process');

// Middleware imports
const Middlewares = require('../middlewares/index.js');

// The login route should have no additional middleware
router.use('/login', loginRouter);

// Super Admin only
router.use('/super-admin', Middlewares.isSuperAdmin, superAdminRouter);

// Admin and Super-Admin acceptable
router.use('/admin', Middlewares.isAdminOrSuperAdmin, adminRouter);

// Student only
router.use('/student', Middlewares.isStudent, studentRouter);

// Company Route: Admin and Super-Admin acceptable
router.use('/recruiter', Middlewares.isAdminOrSuperAdminOrRecruiter, recruiterRouter);

// Job Listing 
router.use('/job-listings', jobListingRouter);

// Hiring Process
router.use('/hiring-process', hiringProcessRouter);


router.use('/user', userRouter);

// Catch all route
router.get("/test", (req, res) => {
    res.send("Welcome to the API!");
});

module.exports = router;