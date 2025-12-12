const { UserRoles } = require("../config/enums");
const { HttpError, HttpCodes } = require("../config/http");

async function isAdminOrSuperAdminOrRecruiter(req, res, next) {

    const user = res.locals.user;
    try {
        if (user.role != UserRoles.SUPER_ADMIN && user.role != UserRoles.ADMIN && user.role !== UserRoles.RECRUITER)
            throw new HttpError(HttpCodes.UNAUTHORIZED, "Neither an admin , a Recruiter nor a super admin", Error().stack);
        res.locals.superAdmin = await user.getSuperAdmin();
        res.locals.admin = await user.getAdmin();
        res.locals.recruiter = await user.getRecruiter();

        return next();
    } catch (error) {
        next(error);
    }
}

module.exports = isAdminOrSuperAdminOrRecruiter;
