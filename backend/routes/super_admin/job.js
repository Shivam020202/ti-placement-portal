const router = require("express").Router();
const adminController = require("../../controllers/jobListings/admin");

// Get all jobs page data (active and inactive)
router.get("/job-page", adminController.getJobPageData);

// Update job status (Approve/Reject/Request Changes)
router.patch("/:id/status", adminController.updateJobStatus);

// Assign admin to job listing
router.post("/:jobId/perm", adminController.addAdminToListing);

// Delete job listing
router.delete("/:id", adminController.deleteJobListingById);

// Get specific job by ID
router.get("/:id", adminController.getJobListingById);

module.exports = router;
