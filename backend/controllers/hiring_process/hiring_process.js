const { HiringProcess, GroupDiscussion, CodingRound, Interview, PPT, JobListing } = require('../../models');
const { HttpError, HttpCodes, respond } = require('../../config/http');
const { HiringProcesses } = require('../../config/enums');

const createHiringProcess = async (req, res, next) => {
    const { jobId, index, type, title, startDateTime, endDateTime } = req.body;
    try {
        const job = await JobListing.findByPk(jobId);
        if (!job) {
            return next(new HttpError(HttpCodes.NOT_FOUND, "Job not found"));
        }
        const hiringProcess = await job.createHiringProcess({ index, type, title, startDateTime, endDateTime });
        switch (type) {
            case HiringProcesses.GROUP_DISCUSSION: {
                const { venue, topic, link } = req.body;
                const groupDiscussion = await hiringProcess.createGroupDiscussion({ venue, topic, link });
                return respond(res, HttpCodes.CREATED, "Group Discussion created", groupDiscussion, hiringProcess);
            }
            case HiringProcesses.CODING_ROUND: {
                const { venue, link } = req.body;
                const codingRound = await hiringProcess.createCodingRound({ venue, link });
                return respond(res, HttpCodes.CREATED, "Coding Round created", codingRound, hiringProcess);
            }
            case HiringProcesses.INTERVIEW: {
                const { venue, type, link } = req.body;
                const interview = await hiringProcess.createInterview({ venue, type, link });
                return respond(res, HttpCodes.CREATED, "Interview created", interview, hiringProcess);
            }
            case HiringProcesses.PPT: {
                const { venue, link } = req.body;
                const ppt = await hiringProcess.createPPT({ venue, link });
                return respond(res, HttpCodes.CREATED, "PPT created", ppt, hiringProcess);
            }
        }
    } catch (error) {
        return next(error);
    }
}



const getHiringProcessById = async (req, res, next) => {
    const { id } = req.params;
    try {
        // TODO: Check this include wala,  not sure if it's supposed to be written like this or not
        const hiringProcess = await HiringProcess.findByPk(id, { include: [GroupDiscussion, CodingRound, Interview, PPT] });
        respond(res, HttpCodes.OK, "Hiring Process retrieved", hiringProcess);
    } catch (error) {
        next(error);
    }
}

const getHiringProcessesByJobId = async (req, res, next) => {
    const { jobId } = req.params;
    try {
        const hiringProcesses = await HiringProcess.findAll({ where: { jobId }, include: [GroupDiscussion, CodingRound, Interview, PPT] });
        respond(res, HttpCodes.OK, "Hiring Processes retrieved", hiringProcesses);
    } catch (error) {
        next(error);
    }
}

// TODO: Make Update and Delete functions

module.exports = { createHiringProcess, getHiringProcessById, getHiringProcessesByJobId };