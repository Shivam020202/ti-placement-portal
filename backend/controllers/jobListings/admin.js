const { StatusTypes } = require("../../config/enums");
const { HttpError, HttpCodes, respond } = require("../../config/http");
const {
	Company,
	JobListing,
	Branch,
	HiringProcess,
	GroupDiscussion,
	CodingRound,
	Interview,
	PPT,
	Student,
	AppliedToJob,
	User,
	Resume,
} = require("../../models");
const ListingReview = require("../../models/listingReview");
const JobBranch = require("../../models/relationships/jobBranch");
const services = require("../../services/jobListings");
const exceljs = require("exceljs");

// GET ALL JOBS
const getAllJobListings = async (req, res, next) => {
	try {
		const jobListings = await JobListing.findAll({});

		if (!jobListings.length) {
			throw new HttpError(
				HttpCodes.NOT_FOUND,
				"No Job Listings found",
				Error().stack
			);
		}

		return respond(res, HttpCodes.OK, "Job Listings found", jobListings);
	} catch (error) {
		next(error);
	}
};

// CREATE JOBS
const createJobListing = async (req, res, next) => {
	const { companyId, jobListingData, branchWiseMinCgpa } = req.body;
	const user = res.locals.user;
	try {
		console.log(companyId);

		const company = await Company.findByPk(companyId);

		console.log(company);
		if (!req.files && !req.files['descriptionFile']){
			throw new HttpError(
				HttpCodes.BAD_REQUEST,
				"Job Description file not found",
				Error().stack
			);
		}
		const filePath=`/uploads/job_description/${req.files['descriptionFile'][0].filename}`;
		jobListingData.descriptionFile=filePath;
		const jobListed = await services.createJob(
			user,
			company,
			jobListingData,
			branchWiseMinCgpa,
		);

		return respond(
			res,
			HttpCodes.CREATED,
			"Job Listing created",
			jobListed
		);
	} catch (error) {
		next(error);
	}
};

// VERIFY JOBS
async function verifyJob(req, res, next) {
	const jobId = req.params.id;
	const user = res.locals.user;

	try {
		const ApprovedReview = ListingReview.update(
			{
				status: StatusTypes.APPROVED,
				statusReason: `Approved by ${user.fullName}`,
			},
			{ where: { jobListingId: jobId } }
		);

		if (!ApprovedReview) throw new Error("Invalid Job Id");

		res.status(200).json({
			ApprovedReview,
		});
	} catch (error) {
		next(error);
	}
}

// GET UNVERIFIED JOBS
async function getUnverifiedJobs(req, res, next) {
	try {
		const jobs = await JobListing.findAll({
			include: [
				{
					model: ListingReview,
					as: "Review",
					where: {
						status: "under_review",
					},
				},
				Company,
			],
		});

		console.log(jobs);

		res.status(200).json({
			jobs,
		});
	} catch (error) {
		next(error);
	}
}

async function getAppliedStds(req, res, next) {
	const jobId = req.params.id;
	console.log("jobId is ", jobId);
	try {
		const job = await JobListing.findOne({
			include: [
				{
					model: Student,
					through: AppliedToJob,
					include: User,
				},
				Company,
			],
			where: { id: jobId },
		});

		console.log(job);
		if (!job) throw new Error("Invalid Job Id ");

		res.status(200).json({
			job,
		});
	} catch (error) {
		next(error);
	}
}

// DELETE JOB BY ID
const deleteJobListingById = async (req, res, next) => {
	const jobListingId = req.params.id;

	try {
		const deletedListing = await JobListing.destroy({
			where: { id: jobListingId },
		});

		if (!deletedListing) {
			throw new HttpError(
				HttpCodes.NOT_FOUND,
				"Job Listing not found",
				Error().stack
			);
		}

		respond(res, HttpCodes.OK, "Job Listing deleted", deletedListing);
	} catch (error) {
		next(error);
	}
};

// DELETE STD JOB APP
async function deleteStdJobApp(req, res, next) {
	const { jobId, stdRollNo } = req.query;

	console.log("jobid", req);

	try {
		const job = await JobListing.findByPk(jobId);

		if (!job) {
			throw new HttpError(
				HttpCodes.NOT_FOUND,
				"Job Listing not found",
				Error().stack
			);
		}

		await job.removeStudent(stdRollNo);

		respond(res, HttpCodes.OK, "Job Application deleted");
	} catch (error) {
		next(error);
	}
}

// UPDATE JOBS
async function updateJobListing(req, res, next) {
	const jobListingId = req.params.id;
	const { updatedData } = req.body;

	try {
		const updatedListing = await JobListing.update(
			{
				...updatedData,
			},
			{
				where: { id: jobListingId },
			}
		);

		if (!updatedListing) {
			throw new HttpError(
				HttpCodes.NOT_FOUND,
				"Job Listing not found",
				Error().stack
			);
		}

		respond(res, HttpCodes.OK, "Job Listing updated", updatedListing);
	} catch (error) {
		next(error);
	}
}

// GET JOB PAGE DATA
async function getJobPageData(req, res, next) {
	const inactiveLimit = +req.query.inactiveLimit || 2;
	const activeLimit = +req.query.activeLimit || 4;

	try {
		const Companies = await Company.count();
		const totalListings = await JobListing.count();
		const liveListings = await JobListing.count({
			include: {
				model: ListingReview,
				as: "Review",
				where: {
					status: "approved",
				},
			},
		});

		const activeJobs = await JobListing.findAll({
			include: [
				{
					model: ListingReview,
					as: "Review",
					where: {
						status: "approved",
					},
					include: {
						model: User,
						as: 'InternallyAssignedTo'
					}
				},
				{
					model: User,
					foreignKey: 'addedBy'
				},
				{
					model: HiringProcess,
					include: [GroupDiscussion, CodingRound, Interview, PPT],
				},
				Branch,
				Company,
			],
			order : [['createdAt' , 'DESC']],
			limit: activeLimit,
		});

		const inactiveJobs = await JobListing.findAll({
			include: [
				{
					model: ListingReview,
					as: "Review",
					where: {
						status: "under_review",
					},
					include: {
						model: User,
						as: 'InternallyAssignedTo'
					}
				},
				{
					model: HiringProcess,
					include: [GroupDiscussion, CodingRound, Interview, PPT],
				},
				Branch,
				Company,
			],
			order : [['createdAt' , 'DESC']],
			limit: inactiveLimit,
		});

		// activeJobs.forEach(job =>
		//     job.HiringProcesses = services.refactorHP(job.HiringProcesses)
		// )

		// inactiveJobs.forEach(job =>
		//     job.HiringProcesses = services.refactorHP(job.HiringProcesses)
		// );

		res.status(200).json({
			metrices: { totalListings, liveListings, Companies },
			activeJobs,
			inactiveJobs,
		});
	} catch (error) {
		next(error);
	}
}

// GET JOB BY ID
const getJobListingById = async (req, res, next) => {
	const jobListingId = req.params.id;

	try {
		const jobListing = await JobListing.findByPk(jobListingId, {
			include: [
				Company,
				Branch,
				{
					model: ListingReview,
					as: "Review",
					include: {
						model: User,
						as: 'InternallyAssignedTo'
					}
				},
				{
					model: HiringProcess,
					include: [GroupDiscussion, CodingRound, Interview, PPT],
				},
			],
		});

		if (!jobListing) {
			throw new HttpError(
				HttpCodes.NOT_FOUND,
				"Job Listing not found",
				Error().stack
			);
		}

		jobListing.HiringProcesses = services.refactorHP(
			jobListing.HiringProcesses
		);

		respond(res, HttpCodes.OK, "Job Listing found", jobListing);
	} catch (error) {
		next(error);
	}
};

async function exportAppliedStds(req, res, next) {
	// TODO: Add Resume Link accordingly
	const jobId = req.params.id;
	const Columns = req.query.columns;

	try {
		const job = await JobListing.findOne({
			include: [
				{
					model: Student,
					through: AppliedToJob,
					include: [
						{
							model: User,
							include: Resume,
						},
					],
				},
				Company,
			],
			where: { id: jobId },
		});

		const workbook = new exceljs.Workbook();
		const sheet = workbook.addWorksheet("Applied Students");

		sheet.columns = [
			// Traverse through all the attributes and add them as columns
			...Columns.map((col) => ({
				header: col.label,
				key: col.label,
				width: 20,
			})),
		];

		// console.log(job.Students[0].AppliedToJob.resume)

		let data = job.Students.map((student) => {
			let studentData = {};
			Columns.forEach((col) => {
				const cols = col.value.split(".");
				studentData[col.label] = cols.length <= 1 ?
					student[cols[0]] : cols.length == 2 ? student[cols[0]][cols[1]] : student[cols[0]][cols[1]][cols[2]];
			});
			return studentData;
		});

		sheet.addRows(data);
		res.setHeader(
			"Content-Type",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
			"Content-Disposition",
			"attachment; filename=students.xlsx"
		);
		await workbook.xlsx.write(res);
		res.end();
	} catch (error) {
		next(error);
	}
}

async function sendToRecruiter(req, res, next) {
	const jobId = req.body.jobId;

	try {
		const updatedStds = await AppliedToJob.update(
			{ sentToRecruiter: true },
			{
				where: { JobListingId: jobId },
				returning: true,
			}
		);

		if (!updatedStds) {
			throw new Error("Already sent to Recruiter");
		}

		res.status(200).json({
			result: updatedStds,
		});
	} catch (error) {
		next(error);
	}
}

const addAdminToListing = async (req, res, next) => {
	const admins = req.body.admins;
	const jobId = req.params.jobId;

	try {
		const jobReview = await ListingReview.findOne({
			include: [
				{
					model: JobListing,
					as: "JobListing",
					where: { id: jobId }
				},
			]
		});

		if (!jobReview) {
			throw new HttpError(HttpCodes.NOT_FOUND, "Invalid Job Id");
		}

		admins.forEach(async (item) => {
			const admin = await User.findByPk(item.email);
			if (!admin) throw new Error("Invalid Admin Id");
			await jobReview.addInternallyAssignedTo(admin)
		})

		return respond(res, HttpCodes.OK, "Admin added to listing");
	} catch (error) {
		console.log(error)
		next(error);
	}
};

const getAdminsForListing = async (req, res, next) => {
	const jobId = req.params.jobId;

	try {
		const jobReview = await ListingReview.findOne({
			include: [
				{
					model: JobListing,
					as: "JobListing",
					where: { id: jobId }
				},
				{
					model: User,
					as: 'InternallyAssignedTo'
				}
			]
		});

		if (!jobReview) {
			throw new HttpError(HttpCodes.NOT_FOUND, "Invalid Job Id");
		}
		const admins = jobReview.InternallyAssignedTo;
		return respond(res, HttpCodes.OK, "Admins found", admins);
	} catch (error) {
		console.log(error);
		next(error);
	}
}

const removeAdminFromListing = async (req, res, next) => {
	const { jobId, adminId } = req.params;

	try {
		const listing = await JobListing.findByPk(jobId);
		const admin = await User.findByPk(adminId);

		if (!listing || !admin) {
			throw new HttpError(HttpCodes.NOT_FOUND, "Invalid Job or Admin Id");
		}

		await listing.removeInternallyAssignedTo(admin);
		return respond(res, HttpCodes.OK, "Admin removed from listing");
	} catch (error) {
		next(error);
	}
}

module.exports = {
	getAllJobListings,
	createJobListing,
	verifyJob,
	getUnverifiedJobs,
	deleteJobListingById,
	updateJobListing,
	getJobPageData,
	getJobListingById,
	getAppliedStds,
	deleteStdJobApp,
	exportAppliedStds,
	sendToRecruiter,
	addAdminToListing,
	getAdminsForListing,
	removeAdminFromListing
};
