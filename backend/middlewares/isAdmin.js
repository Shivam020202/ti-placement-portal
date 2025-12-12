const {UserRoles} = require("../config/enums");
const {HttpError, HttpCodes} = require("../config/http");

async function isAdmin(req, res, next) {

    const user = res.locals.user;
    try {   
        if(user.role != UserRoles.ADMIN)
            throw new HttpError(HttpCodes.UNAUTHORIZED, "This user is not an Admin", Error().stack);
        res.locals.admin = await user.getAdmin();

        return next();
    } catch (error) {
        next(error);
    }
}

module.exports = isAdmin;
