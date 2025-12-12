const { Skill } = require('../../models');
const { HttpError, HttpCodes, respond } = require('../../config/http');

const createSkill = async (req, res, next) => {
    const { name } = req.body;
    try {
        const [skill, created] = await Skill.findOrCreate({
            where: { name },
            defaults: { name }
        });
        if (!created) {
            throw new HttpError(HttpCodes.CONFLICT, "Skill already exists", Error().stack);
        }
        respond(res, HttpCodes.CREATED, "Skill created", skill);
    } catch (error) {
        next(error);
    }
}

const getAllSkills = async (req, res, next) => {
    try {
        const skills = await Skill.findAll();
        respond(res, HttpCodes.OK, "Skills fetched", skills);
    } catch (error) {
        next(error);
    }
}

const addSkillsToStudent = async(req, res, next) => {
    const skills = req.body.skills;
    const dbSkills = [];
    try {
        for (let skill of skills) {
            const [dbSkill] = await Skill.findOrCreate({
                where: { name: skill },
                defaults: { name: skill }
            });
            dbSkills.push(dbSkill);
        }
        const student = res.locals.student;
        await student.setSkills(dbSkills);
        respond(res, HttpCodes.CREATED, "Skills added to student", dbSkills);
    } catch (error) {
        next(error);
    }
}

const getSkillsByStudent = async(req, res, next) => {
    const student = res.locals.student;
    try {
        const skills = await student.getSkills();
        respond(res, HttpCodes.OK, "Skills fetched", skills);
    } catch (error) {
        next(error);
    }
}

module.exports = {createSkill, getAllSkills, addSkillsToStudent, getSkillsByStudent};
