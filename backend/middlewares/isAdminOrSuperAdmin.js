const { UserRoles } = require("../config/enums");
const { HttpError, HttpCodes } = require("../config/http");

async function isAdminOrSuperAdmin(req, res, next) {

    const user = res.locals.user;
    try {
        if (user.role != UserRoles.SUPER_ADMIN && user.role != UserRoles.ADMIN)
            throw new HttpError(HttpCodes.UNAUTHORIZED, "Neither an admin nor a super admin", Error().stack);
        res.locals.superAdmin = await user.getSuperAdmin();
        res.locals.admin = await user.getAdmin();

        return next();
    } catch (error) {
        next(error);
    }
}

module.exports = isAdminOrSuperAdmin;
