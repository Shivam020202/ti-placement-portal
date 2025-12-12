const { JobListing, Student, User, Branch } = require('../../models');
const { HttpCodes, HttpError, respond } = require('../../config/http');

//get all students by jobId
async function getStudentsAppliedToJob(req, res, next) {
    const jobId = req.params.jobId;
    try {
        const job = await JobListing.findByPk(jobId);
        if (!job) {
            throw new HttpError(HttpCodes.NOT_FOUND, 'Job not found');
        }
        const students = await job.getStudents();
        respond(res, HttpCodes.OK, 'Students fetched', students);
    } catch (error) {
        next(error);
    }
}

async function getAllStds(req, res, next) {

    const limit = +req.params.limit;

    try {

        const stds = await Student.findAll({
            include : [
                User
            ],
            limit,
            order: [['createdAt', 'DESC']]
        })

        respond(res, HttpCodes.OK, "Students Found", stds);

    } catch (error) {
        next(error);
    }
}

/**
 * This function fetches all jobs and the students who have applied to them
 * TODO: Add pagination and adapt for further use cases
 */
async function getAllJobsAndStudents(req, res, next) {
    try {
        const jobs = await JobListing.findAll({
            include: [
                {
                    model: Student,
                }
            ]
        });
        respond(res, HttpCodes.OK, 'All jobs and students fetched', jobs);
    } catch (error) {
        next(error);
    }
}

// delete student from job
async function deleteStudentFromJob(req, res, next) {
    const jobId = req.params.jobId;
    const studentId = req.params.studentId;
    try {
        const job = await JobListing.findByPk(jobId);
        if (!job) {
            throw new HttpError(HttpCodes.NOT_FOUND, 'Job not found');
        }
        const student = await Student.findByPk(studentId);
        if (!student) {
            throw new HttpError(HttpCodes.NOT_FOUND, 'Student not found');
        }
        await job.removeStudent(student);
        respond(res, HttpCodes.OK, 'Student removed from job');
    } catch (error) {
        next(error);
    }
}

async function getStdById(req , res , next){

    console.log('hello wordl')

    const id = req.params.id;

    try{
	    const std = await Student.findByPk(id , {
            include :[
                User,
                Branch
            ]
        });

	    if(!std) throw new Error("Incorrect Std Id");
	
	    respond(res, HttpCodes.OK , 'Student Found' , std);
	    
    }catch(err){
	    next(err);
    }


}

// TODO: debar student from any further jobs
// 1. bool debar/nhi hai
// 2. no. of jobs debar
// 3. debar from a specific company

module.exports = {
    getStudentsAppliedToJob,
    getAllJobsAndStudents,
    deleteStudentFromJob,
    getAllStds,
    getStdById
};
