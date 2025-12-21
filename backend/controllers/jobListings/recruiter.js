const { HttpCodes, respond } = require("../../config/http");
const {
  HiringProcess,
  GroupDiscussion,
  CodingRound,
  Interview,
  PPT,
  JobListing,
  Company,
  Branch,
  Student,
  AppliedToJob,
  User,
  Resume,
} = require("../../models");
const services = require("../../services/jobListings");
const exceljs = require("exceljs");

// CREATE JOBS
async function createJobsByRecruiters(req, res, next) {
  const { jobListingData, branchWiseMinCgpa } = req.body;
  const recruiter = res.locals.recruiter;
  const user = res.locals.user;

  try {
    const company = await recruiter.getCompany();
    if (!company) throw new Error("Please Create a Company First");

    const jobListed = await services.createJob(
      user,
      company,
      jobListingData,
      branchWiseMinCgpa,
      next
    );

    console.log("Final Jobs before Sending : ", jobListed);
    return respond(res, HttpCodes.CREATED, "Job Listing created", jobListed);
  } catch (error) {
    next(error);
  }
}

// GET ALL JOBS
async function getAllJobsForRecruiters(req, res, next) {
  const user = res.locals.user;

  try {
    const jobs = await user.getJobListings({
      include: [
        { association: "Review" },
        {
          model: HiringProcess,
          include: [GroupDiscussion, CodingRound, Interview, PPT],
        },
      ],
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

// GET JOB
const getJob = async (req, res, next) => {
  const jobListingId = req.params.id;

  try {
    const jobListing = await JobListing.findByPk(jobListingId, {
      include: [
        Company,
        Branch,
        "Review",
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

// Get Applied Stds to Job
async function getAppliedStds(req, res, next) {
  const jobId = req.params.id;

  try {
    const job = await JobListing.findOne({
      include: [
        {
          model: Student,
          through: {
            model: AppliedToJob,
            where: { sentToRecruiter: true },
          },
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

async function exportAppliedStds(req, res, next) {
  // TODO: Add Resume Link accordingly
  const jobId = req.params.id;
  const Columns = req.query.columns;

  try {
    console.log("hi");

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
        header: col,
        key: col,
        width: 20,
      })),
    ];

    let data = job.Students.map((student) => {
      let studentData = {};
      Columns.forEach((col) => {
        studentData[col] = student[col];
      });
      return studentData;
    });

    sheet.addRows(data);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=students.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
}

async function updateJob(req, res, next) {
  const { jobId } = req.params;
  const { updatedData, updatedHW } = req.body;

  try {
    const job = await JobListing.findByPk(jobId);

    if (!job) {
      throw new Error("Job not found");
    }

    // Update job listing fields if provided
    if (updatedData) {
      await JobListing.update({ ...updatedData }, { where: { id: jobId } });
    }

    // Update hiring workflow if provided
    if (updatedHW && Array.isArray(updatedHW)) {
      for (const item of updatedHW) {
        await services.updateHiringWorkflow(item, job, "update");
      }
    }

    const updatedJob = await JobListing.findByPk(jobId, {
      include: [
        Company,
        Branch,
        "Review",
        {
          model: HiringProcess,
          include: [GroupDiscussion, CodingRound, Interview, PPT],
        },
      ],
    });

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllJobsForRecruiters,
  createJobsByRecruiters,
  getJob,
  getAppliedStds,
  exportAppliedStds,
  updateJob,
};
