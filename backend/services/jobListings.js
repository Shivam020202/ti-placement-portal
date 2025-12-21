const { HiringProcesses, StatusTypes, VenueTypes } = require("../config/enums");
const { HttpCodes, HttpError } = require("../config/http");
const {
  JobListing,
  Branch,
  Company,
  HiringProcess,
  GroupDiscussion,
  CodingRound,
  Interview,
  PPT,
  Student,
  AppliedToJob,
} = require("../models");
const ListingReview = require("../models/listingReview");

async function getJobsForStudents(std, limit, eligibleJobsOnly) {
  try {
    const jobListings = await JobListing.findAll({
      order: [["createdAt", "DESC"]],
      limit,
      include: [
        Branch,
        Company,
        {
          model: ListingReview,
          as: "Review",
          where: {
            status: "approved",
          },
        },
        // {
        //     model: Student,
        //     where: { rollNumber: std.rollNumber },
        //     through: AppliedToJob
        // }
      ],
    });

    // get all jobs with eligibility
    if (!eligibleJobsOnly) {
      jobListings.forEach(async (job) => {
        job.dataValues.eligibility = await isStudentEligible(std, job);
      });
      return jobListings;
    }

    // get eligible jobs only
    const eligibleJobs = jobListings.filter(
      async (job) => await isStudentEligible(std, job).eligibe
    );

    return eligibleJobs;
  } catch (error) {
    console.log(error);
    return new Error(error.message);
  }
}

async function createJob(user, company, jobListingData, branchWiseMinCgpa) {
  try {
    if (!company) {
      throw new HttpError(
        HttpCodes.NOT_FOUND,
        "Company not found",
        Error().stack
      );
    }

    const jobListed = await user.createJobListing({
      ...jobListingData,
      companyId: company.id,
    });

    // ensure every new job has an associated review so super-admins can approve/reject
    const existingReview = await ListingReview.findOne({
      where: { jobListingId: jobListed.id },
    });
    if (!existingReview) {
      // Auto-approve jobs created by super-admin, otherwise set to under_review
      const reviewStatus =
        user.role === "super-admin"
          ? StatusTypes.APPROVED
          : StatusTypes.UNDER_REVIEW;

      await ListingReview.create({
        status: reviewStatus,
        jobListingId: jobListed.id,
      });
    }

    // Use for...of with index to handle async properly and pass index
    for (let i = 0; i < jobListingData.workflowData.length; i++) {
      const item = jobListingData.workflowData[i];
      // Pass the index to createHP (use item.index if provided, otherwise use array index)
      await createHP({ ...item, index: item.index ?? i + 1 }, jobListed);
    }

    let branchDataErrors = [];
    Object.keys(branchWiseMinCgpa).forEach(async (branchCode) => {
      const branch = await Branch.findByPk(branchCode);
      if (!branch) {
        branchDataErrors.push(branchCode);
        return;
      }
      const minCgpa = branchWiseMinCgpa[branchCode];
      await jobListed.addBranch(branch, { through: { minCgpa } });
    });

    if (branchDataErrors.length) {
      throw new Error("Invalid Branch Codes");
    }

    return jobListed;
  } catch (error) {
    throw new Error(error.message);
    return null;
  }
}

async function isStudentEligible(std, job) {
  const reasons = [];

  try {
    let inelgibleBranch = "Branch is not eligible";
    let ineligibleCgpa = "Std cgpa is less than eligible cgpa";

    for (let Branch of job.Branches) {
      const data = Branch.dataValues;
      if (data.code == std.branchCode) {
        inelgibleBranch = null;
        if (data.JobBranch.dataValues.minCgpa <= std.cgpa)
          ineligibleCgpa = null;
        break;
      }
    }
    if (inelgibleBranch) reasons.push(inelgibleBranch);
    if (ineligibleCgpa) reasons.push(ineligibleCgpa);

    if (!job.gradYear.includes(std.gradYear.toString()))
      reasons.push("This job is not valid for your year");

    if (!reasons.length) return { eligible: true };
    else return { eligible: false, reasons };
  } catch (error) {
    console.log(error);
    return new Error(error.message);
  }
}

async function createHP(workflowData, job) {
  const { index, type, title, date } = workflowData;
  try {
    console.log(workflowData);

    if (!job) {
      return new Error("Job Doesn't Exists");
    }

    const hiringProcess = await job.createHiringProcess({
      index,
      type,
      title,
      startDateTime: date.from,
      endDateTime: date.to,
    });

    switch (type) {
      case HiringProcesses.GROUP_DISCUSSION: {
        const { venue, topic, link } = workflowData;
        await hiringProcess.createGroupDiscussion({ venue, topic, link });
        break;
      }
      case HiringProcesses.CODING_ROUND: {
        const { venue, link } = workflowData;
        await hiringProcess.createCodingRound({ venue, link });
        break;
      }
      case HiringProcesses.INTERVIEW: {
        const { venue, interviewType, link } = workflowData;
        console.log(venue, interviewType, link);
        const interview = await hiringProcess.createInterview({
          venue,
          type: interviewType,
          link,
        });
        break;
      }
      case HiringProcesses.PPT: {
        const venue =
          workflowData.venue === VenueTypes.ONLINE
            ? VenueTypes.ONLINE
            : VenueTypes.OFFLINE;
        const link = venue === VenueTypes.ONLINE ? workflowData.link : null;
        await hiringProcess.createPPT({ venue, link });
        break;
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

async function updateHiringWorkflow(workflowData, job, status) {
  const { index, type, title, date, id } = workflowData;
  try {
    if (!job) {
      return new Error("Job Doesn't Exists");
    }

    if (status == "update") {
      await HiringProcess.update(
        {
          index,
          type,
          title,
          startDateTime: date.from,
          endDateTime: date.to,
        },
        { where: { id } }
      );
      switch (type) {
        case HiringProcesses.GROUP_DISCUSSION: {
          const { venue, topic, link, groupDiscussionId, id } = workflowData;
          await GroupDiscussion.update(
            { venue, topic, link },
            { where: { groupDiscussionId } }
          );
          break;
        }
        case HiringProcesses.CODING_ROUND: {
          const { venue, link } = workflowData;
          await CodingRound.update(
            { venue, link },
            { where: { id: workflowData.codingRoundId } }
          );
          break;
        }
        case HiringProcesses.INTERVIEW: {
          const { venue, interviewType, link } = workflowData;
          await Interview.update(
            { venue, type: interviewType, link },
            { where: { id: workflowData.InterviewId } }
          );
          break;
        }
        case HiringProcesses.PPT: {
          const { venue, link } = workflowData;
          await PPT.update(
            { venue, link },
            { where: { id: workflowData.pptId } }
          );
          break;
        }
      }

      return;
    }

    const hiringProcess = await job.createHiringProcess({
      index,
      type,
      title,
      startDateTime: date.from,
      endDateTime: date.to,
    });

    switch (type) {
      case HiringProcesses.GROUP_DISCUSSION: {
        const { venue, topic, link } = workflowData;
        await hiringProcess.createGroupDiscussion({ venue, topic, link });
        break;
      }
      case HiringProcesses.CODING_ROUND: {
        const { venue, link } = workflowData;
        await hiringProcess.createCodingRound({ venue, link });
        break;
      }
      case HiringProcesses.INTERVIEW: {
        const { venue, interviewType, link } = workflowData;
        console.log(venue, interviewType, link);
        await hiringProcess.createInterview({
          venue,
          type: interviewType,
          link,
        });
        break;
      }
      case HiringProcesses.PPT: {
        const { venue, link } = workflowData;
        await hiringProcess.createPPT({ venue, link });
        break;
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

function refactorHP(events) {
  let newEvents = {};
  newEvents.dataValues = events.map((event) => {
    let process;
    let processName;
    switch (event.type) {
      case "group-discussion": {
        process = event.GroupDiscussion;
        processName = "Group Discussion";
        break;
      }
      case "coding-round": {
        process = event.CodingRound;
        processName = "Coding Round";
        break;
      }
      case "interview": {
        process = event.Interview;
        processName = "Interview";
        break;
      }
      case "ppt": {
        process = event.PPT;
        processName = "PPT";
        break;
      }
    }
    return {
      process,
      processTitle: processName,
    };
  });
  return newEvents;
}

module.exports = {
  getJobsForStudents,
  isStudentEligible,
  createJob,
  refactorHP,
  updateHiringWorkflow,
};
