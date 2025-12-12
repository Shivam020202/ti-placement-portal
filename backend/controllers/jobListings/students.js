const { Op, where } = require("sequelize");
const { Company, JobListing, Branch, Resume, HiringProcess, GroupDiscussion, CodingRound, Interview, PPT, AppliedToJob, Student } = require("../../models");
const services = require('../../services/jobListings');
const { bucket } = require("../../config/firebase");
const { ref } = require("firebase/storage");
const { downloadFileFromFirebase, uploadFileToDrive } = require("../../services/googleDrive");
const ListingReview = require("../../models/listingReview");
const { respond, HttpCodes, HttpError } = require("../../config/http");


// GET JOBS FOR STUDENTS
async function getStudentsJobs(req, res, next) {

    const student = res.locals.student;
    const limit = parseInt(req.params.limit) || 5;
    console.log(limit);
    const eligibleJobsOnly = req.body.eligibleJobsOnly;

    try {

        if (eligibleJobsOnly) {
            const jobListings = await JobListing.findAll({
                where: {
                    gradYear: {
                        [Op.like]: `%${student.gradYear}%`
                    }
                },
                include: [
                    Company,
                    {
                        model: Branch,
                        where: {
                            code: student.branchCode
                        },
                        through: {
                            where: {
                                minCgpa: {
                                    [Op.lte]: student.cgpa
                                }
                            }
                        }
                    }],
                limit
            });
            res.status(200).json({
                jobListings
            })
        }

        const jobListings = await services.getJobsForStudents(
            student,
            limit,
            false
        );

        res.status(200).json({
            jobListings
        })


    } catch (error) {
        next(error);
    }
}


//GET JOB BY JOBID
async function getJobById(req, res, next) {

    const jobId = req.params.jobId;
    const std = res.locals.student;

    try {

        const job = await JobListing.findByPk(jobId, {
            include: [
                Company,
                Branch,
                // {
                //     model : Student,
                //     through : AppliedToJob
                // },
                {
                    model: ListingReview,
                    as: 'Review'
                },
                {
                    model: HiringProcess,
                    include: [GroupDiscussion, CodingRound, Interview, PPT]
                },
            ]
        });

        if (!job || job.Review.status == "under_review")
            throw new Error("Invalid Job Id");

        const appliedToJob = await AppliedToJob.findOne({
            where: {
                JobListingId: job.id,
                StudentRollNumber: std.rollNumber
            }
        });
        job.dataValues.appliedToJob = appliedToJob;
        job.dataValues.eligibility = await services.isStudentEligible(std, job);

        respond(res, HttpCodes.OK, "Job Listing found", job);


    } catch (error) {
        next(error);
    }
}

// CREATE STUDENT-JOB APPLICATION
async function appliedToJob(req, res, next) {

    const { jobId, resumeId, coverLetter, personalEmail } = req.body;
    const std = res.locals.student;
    const user = res.locals.user;
    try {

        const job = await JobListing.findByPk(jobId, {
            include: Branch
        });
        if (!job) throw new Error("Invalid Job Id");

        const isEligible = await services.isStudentEligible(std, job);
        console.log(isEligible)
        if (!isEligible.eligible)
            throw new Error(`${user.fullName} is ineligible for ${job.title} : ${isEligible.reasons[0]}`);

        const existingResume = await Resume.findOne({
            where: {
                id: resumeId,
                user: user.email
            },
        });
        if (!existingResume) throw new Error("Invalid Resume Id for this student");

        const blob = ref(bucket, existingResume.url);
        const tempFilePath = `${process.env.TEMP_FILE_PATH}/${existingResume.name}`;
        await downloadFileFromFirebase(blob, tempFilePath);
        const resume = await uploadFileToDrive(tempFilePath, existingResume.name);

        const newJob = await job.addStudent(
            std,
            {
                through: {
                    resume,
                    coverLetter,
                    personalEmail,
                    stdCgpa: std.cgpa
                }
            }
        );

        res.status(200).json({
            newJob
        })
    } catch (error) {
        next(error);
    }
}

//GET STUDENT JOB APPLICATIONS
async function getAppliedJobs(req, res, next) {

    const limit = +req.params.limit;
    const std = res.locals.student;

    try {
        const jobs = await JobListing.findAll({
            include: [
                'Review',
                {
                    model: HiringProcess,
                    include: [GroupDiscussion, CodingRound, Interview, PPT]
                },
                Company,
                Branch,
                {
                    model: Student,
                    where: { rollNumber: std.rollNumber },
                    through: AppliedToJob
                }
            ],
            limit
        });

        res.status(200).json(
            jobs
        );

    } catch (error) {
        console.log(error);
        next(error);
    }
}

//withdraw application
async function deleteJobApplication(req, res, next) {
    const jobId = req.params.jobId;
    const student = res.locals.student;
    try {
        const job = await JobListing.findByPk(jobId);
        if (!job) {
            throw new HttpError("Job not found", HttpCodes.NOT_FOUND);
        }
        await job.removeStudent(student);
        respond(res, HttpCodes.OK, "Application withdrawn successfully");
    } catch (error) {
        next(error);
    }
}


module.exports = {
    getStudentsJobs,
    appliedToJob,
    getJobById,
    deleteJobApplication,
    getAppliedJobs
}
