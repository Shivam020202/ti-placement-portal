const { Sequelize, Op } = require("sequelize");
const { StatusTypes } = require("../config/enums");
const { HttpError, HttpCodes, respond } = require("../config/http");
const { Student, Company, JobListing, Branch, HiringProcess, GroupDiscussion, CodingRound, Interview, PPT, Resume } = require("../models");
const ListingReview = require("../models/listingReview");
const services = require('../services/jobListings');







module.exports = {
    createJobListing,
    deleteJobListingById,
    updateJobListing,
    getJobListingById,
    getAllJobListings,
    getStudentsJobs,
    createJobsByRecruiters,
    getAllJobsForRecruiters,
    verifyJob,
    getUnverifiedJobs,
    appliedToJob,
    getJobPageData
}
