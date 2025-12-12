const express = require("express");
const JobListingController = require("../../controllers/jobListings/students");
const router = express.Router();

// get Job Listings for students
router.get('/:limit', JobListingController.getStudentsJobs);

router.get('/get-job/:jobId', JobListingController.getJobById);

router.post('/apply-to', JobListingController.appliedToJob);

router.get('/applied/:limit' , JobListingController.getAppliedJobs)

router.delete('/:jobId', JobListingController.deleteJobApplication);

module.exports = router;