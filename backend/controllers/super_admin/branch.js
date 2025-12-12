const { Branch } = require('../../models');
const { HttpError, HttpCodes, respond } = require('../../config/http');

const createBranch = async (req, res, next) =>  {
    const {code, name} = req.body;
    try {
        const [branch, created] = await Branch.findOrCreate({
            where: {code},
            defaults: {code, name}
        });
        if(!created) {
            throw new HttpError(HttpCodes.CONFLICT, "Branch already exists", Error().stack);
        }
        respond(res, HttpCodes.CREATED, "Branch created", branch);
    } catch (error) {
        next(error);
    }
}

const getAllBranches = async (req, res, next) => {
    console.log('get All branches');
    try {
        const branches = await Branch.findAll();
        respond(res, HttpCodes.OK, "Branches fetched", branches);
    } catch (error) {
        next(error);
    }
}

const getBranchByCode = async (req, res, next) => {
    const code = req.params;
    try {
        const branch = await Branch.findByPk(code);
        if(!branch) {
            throw new HttpError(HttpCodes.NOT_FOUND, "Branch not found", Error().stack);
        }

        respond(res, HttpCodes.OK, "Branch found", branch); 
    } catch (error) {
        next(error);
    }
}

// Updates name of branch
const updateBranch = async (req, res, next) => {
    const code = req.params;
    const {name} = req.body;

    try {
        const branch = await Branch.findByPk(code);

        if(!branch) {
            throw new HttpError(HttpCodes.NOT_FOUND, "Branch not found", Error().stack);
        }

        branch.name = name;
        await branch.save();

        respond(res, HttpCodes.OK, "Branch updated", branch);
    } catch (error) {
        next(error);
    }
}

const deleteBranch = async (req, res, next) => {
    const code = req.params;
    try {
        const branch = await Branch.findByPk(code);

        if(!branch) {
            throw new HttpError(HttpCodes.NOT_FOUND, "Branch not found", Error().stack);
        }
        await branch.destroy();

        respond(res, HttpCodes.OK, "Branch deleted", branch);
    } catch (error) {
        next(error);
    }
}

module.exports = {createBranch, getAllBranches, getBranchByCode, updateBranch, deleteBranch};