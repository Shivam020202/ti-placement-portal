const express = require("express");
const JobListingController = require("../../controllers/jobListings/admin");
const router = express.Router();
const upload=require("../../config/multer");

// Create a new job listing ( Admins & SuperAdmins )
router.post("/", upload('./uploads/job_description'),JobListingController.createJobListing);
// Get all job listings
router.get("/", JobListingController.getAllJobListings);

// Get matrices & unapproved , active jobs
router.get("/job-page", JobListingController.getJobPageData);

// Get Unverified Jobs
router.get("/unverified-jobs", JobListingController.getUnverifiedJobs);

// Get Applied Stds for a Job
router.get("/applied-stds/:id", JobListingController.getAppliedStds);

// Get Applied Stds for a Job
router.get("/export-applied-std/:id", JobListingController.exportAppliedStds);

// Sent Applications to Recruiters
router.put("/send-to-recruiter", JobListingController.sendToRecruiter);

// Get job listing by id
router.get("/:id", JobListingController.getJobListingById);

// Verify a Job
router.put("/verify/:id", JobListingController.verifyJob);

// Delete Job Application for Std
router.delete("/std-job", JobListingController.deleteStdJobApp);

// Delete job listing by id
router.delete("/:id", JobListingController.deleteJobListingById);

// Update job listing by id
router.put("/:id", JobListingController.updateJobListing);

router.post("/:jobId/perm/", JobListingController.addAdminToListing);

router.delete(
	"/:jobId/perm/:adminId",
	JobListingController.removeAdminFromListing
);

router.get("/:jobId/perm", JobListingController.getAdminsForListing);

module.exports = router;
