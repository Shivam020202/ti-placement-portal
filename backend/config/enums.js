const UserRoles = {
    SUPER_ADMIN: 'super-admin',
    ADMIN: 'admin',
    STUDENT: 'student',
    RECRUITER : 'recruiter'
};

const Programs = {
    UG: 'ug',
    PG: 'pg'
};

const Courses = {
    BTECH: 'btech',
    BE: 'be',
    MTECH: 'mtech',
    PHD: 'phd'
};

const ScoreTypes = {
    PERCENTAGE: 'percentage',
    CGPA: 'cgpa'
};

const HiringProcesses = {
    PPT: 'ppt',
    GROUP_DISCUSSION: 'group-discussion',
    CODING_ROUND: 'coding-round',
    INTERVIEW: 'interview',
}

const VenueTypes = {
    ONLINE: 'online',
    OFFLINE: 'offline'
}

const InterviewTypes = {
    TECHNICAL: 'technical',
    HR: 'hr'
}


const SkillCategories = {
    LANGUAGES: 'languages',
    FRAMEWORKS: 'frameworks',
    TOOLS: 'tools',
    DATABASES: 'databases',
    LIBRARIES: 'libraries',
    SOFT_SKILLS: 'soft-skills'
}

const StatusTypes = {
    UNDER_REVIEW: 'under_review',
    CHANGES_REQUESTED: 'changes_requested',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

const RoleTypes = {
    FTE : 'FTE',
    INTERNSHIP: 'Internship',
    INTERNSHIP_FTE : "Internship + FTE",
    INTERNSHIP_PPO : "Internship + PPO"
}
 
module.exports = {
    UserRoles, 
    Programs, 
    Courses, 
    ScoreTypes, 
    HiringProcesses, 
    VenueTypes, 
    InterviewTypes,
    SkillCategories,
    StatusTypes,
    RoleTypes
};