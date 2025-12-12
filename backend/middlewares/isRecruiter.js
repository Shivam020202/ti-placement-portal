const { UserRoles } = require("../config/enums");
const { HttpError, HttpCodes } = require("../config/http");

async function isRecruiter(req, res, next) {

    const user = res.locals.user;
    try {
        if (user.role != UserRoles.RECRUITER)
            throw new HttpError(HttpCodes.UNAUTHORIZED, "This user is not an Recruiter", Error().stack);
        res.locals.recruiter = await user.getRecruiter();

        return next();
    } catch (error) {
        next(error);
    }
};

module.exports = isRecruiter
