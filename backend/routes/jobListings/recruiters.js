const express = require("express");
const JobListingController = require("../../controllers/jobListings/recruiter");
const router = express.Router();

router.post('/', JobListingController.createJobsByRecruiters);

router.put('/:jobId', JobListingController.updateJob);

router.get('/', JobListingController.getAllJobsForRecruiters);

router.get('/applied-stds/:id', JobListingController.getAppliedStds);

router.get('/export-applied-std/:id', JobListingController.exportAppliedStds)

router.patch(
  "/applications/status",
  JobListingController.bulkUpdateApplicationStatus
);

router.get('/:id', JobListingController.getJob);

module.exports = router;
