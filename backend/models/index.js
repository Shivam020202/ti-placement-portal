const sequelize = require("../config/database.js");
const User = require("./user.js");
const Student = require("./userRoles/student.js");
const SuperAdmin = require("./userRoles/super_admin.js");
const Admin = require("./userRoles/admin.js");
const Branch = require("./branch.js");
const Company = require("./company.js");
const JobListing = require("./jobListing.js");
const JobBranchRelationship = require("./relationships/jobBranch.js");
const Recruiter = require("./userRoles/recruiter.js");
const HiringProcess = require("./hiringProcesses/hiring_process.js");
const CodingRound = require("./hiringProcesses/coding_round.js");
const GroupDiscussion = require("./hiringProcesses/gd.js");
const PPT = require("./hiringProcesses/ppt.js");
const Interview = require("./hiringProcesses/interview.js");
const Skill = require("./skill.js");
const ListingReview = require("./listingReview.js");
const { StatusTypes } = require("../config/enums.js");
const AppliedToJob = require("./relationships/appliedToJob.js");
const Resume = require("./resume.js");
const googleToken = require("./googleToken.js");

User.hasOne(googleToken, { foreignKey: { allowNull: false, name: "user" } });
googleToken.belongsTo(User, { foreignKey: { allowNull: false, name: "user" } });

User.hasOne(Student, { foreignKey: { allowNull: false, name: "user" } });
Student.belongsTo(User, { foreignKey: { allowNull: false, name: "user" } });

User.hasOne(SuperAdmin, { foreignKey: { allowNull: false, name: "user" } });
SuperAdmin.belongsTo(User, { foreignKey: { allowNull: false, name: "user" } });

User.hasOne(Admin, { foreignKey: { allowNull: false, name: "user" } });
Admin.belongsTo(User, { foreignKey: { allowNull: false, name: "user" } });

User.hasOne(Recruiter, { foreignKey: { allowNull: false, name: "user" } });
Recruiter.belongsTo(User, { foreignKey: { allowNull: false, name: "user" } });

User.hasMany(User, {
  foreignKey: { allowNull: true, name: "addedBy" },
  as: "AddedUsers",
});
User.belongsTo(User, {
  foreignKey: { allowNull: true, name: "addedBy" },
  as: "AddedBy",
});

Branch.hasMany(Student, {
  foreignKey: { allowNull: false, name: "branchCode" },
});
Student.belongsTo(Branch, {
  foreignKey: { allowNull: false, name: "branchCode" },
});

Branch.belongsToMany(JobListing, { through: "JobBranch" });
JobListing.belongsToMany(Branch, { through: "JobBranch" });

Company.hasMany(JobListing, {
  foreignKey: { allowNull: false, name: "companyId" },
});
JobListing.belongsTo(Company, {
  foreignKey: { allowNull: false, name: "companyId" },
});

Company.hasMany(Recruiter, {
  foreignKey: { allowNull: false, name: "companyId" },
});
Recruiter.belongsTo(Company, {
  foreignKey: { allowNull: false, name: "companyId" },
});

User.hasMany(JobListing, { foreignKey: "addedBy" });
JobListing.belongsTo(User, { foreignKey: "addedBy" });

Student.belongsToMany(JobListing, { through: AppliedToJob });
JobListing.belongsToMany(Student, { through: AppliedToJob });

JobListing.hasMany(HiringProcess, { foreignKey: { name: "jobId" } });
HiringProcess.belongsTo(JobListing, { foreignKey: { name: "jobId" } });

HiringProcess.hasOne(CodingRound, {
  foreignKey: { allowNull: true, name: "codingRoundId" },
});
CodingRound.belongsTo(HiringProcess, {
  foreignKey: { allowNull: true, name: "codingRoundId" },
});

HiringProcess.hasOne(GroupDiscussion, {
  foreignKey: { allowNull: true, name: "groupDiscussionId" },
});
GroupDiscussion.belongsTo(HiringProcess, {
  foreignKey: { allowNull: true, name: "groupDiscussionId" },
});

HiringProcess.hasOne(PPT, { foreignKey: { allowNull: true, name: "PPTId" } });
PPT.belongsTo(HiringProcess, {
  foreignKey: { allowNull: true, name: "PPTId" },
});

HiringProcess.hasOne(Interview, {
  foreignKey: { allowNull: true, name: "InterviewId" },
});
Interview.belongsTo(HiringProcess, {
  foreignKey: { allowNull: true, name: "InterviewId" },
});

Skill.belongsToMany(Student, { through: "StudentSkill" });
Student.belongsToMany(Skill, { through: "StudentSkill" });

JobListing.hasOne(ListingReview, {
  as: "Review",
  foreignKey: { name: "jobListingId" },
});
ListingReview.belongsTo(JobListing, {
  as: "JobListing",
  foreignKey: { name: "jobListingId" },
});

// TODO: Rethink this
User.hasMany(ListingReview, {
  as: "AssignedListings",
  foreignKey: { name: "assignedTo" },
});
ListingReview.belongsTo(User, {
  as: "AssignedTo",
  foreignKey: { name: "assignedTo" },
});

User.belongsToMany(ListingReview, {
  as: "InterallyAssignedListings",
  through: "ListingPerm",
});
ListingReview.belongsToMany(User, {
  as: "InternallyAssignedTo",
  through: "ListingPerm",
});

// TODO: Add a relation between the user and listing perm to track "addedBy" user

User.hasMany(Resume, { foreignKey: { allowNull: false, name: "user" } });
Resume.belongsTo(User, { foreignKey: { allowNull: false, name: "user" } });

JobListing.afterCreate(async (jobListing, options) => {
  // Select a super-admin at random and assign the job listing to them
  try {
    console.log("hi");
    const superAdmin = await SuperAdmin.findOne();
    const superAdminUser = await superAdmin.getUser();

    const listingReview = await jobListing.createReview({
      status: StatusTypes.UNDER_REVIEW,
      assignedTo: superAdminUser.id,
    });
    console.log(listingReview);
  } catch (e) {
    console.log("Failed to assign job listing to super-admin: " + e.message);
  }
});

module.exports = {
  User,
  Student,
  SuperAdmin,
  Admin,
  Branch,
  Company,
  JobListing,
  JobBranchRelationship,
  Recruiter,
  HiringProcess,
  CodingRound,
  GroupDiscussion,
  PPT,
  Interview,
  Skill,
  Resume,
  AppliedToJob,
  ListingReview,
  sequelize,
};
