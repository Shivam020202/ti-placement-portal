const {User} = require("../models/");
const {UserRoles} = require("../config/enums.js");
const {HttpError, HttpCodes} = require("../config/http.js");

const login = async (req, res, next) => {
    try {
        // User already exists in res.locals because of the middleware
        const user = res.locals.user;
        console.log(user);        
        // Check the user's role
        switch (user.role) {
            case UserRoles.STUDENT:
                const student = await user.getStudent();
                if (!student) {
                    throw new HttpError(HttpCodes.NOT_FOUND, "Student not found", Error().stack);
                }
                return res.status(200).json({ user: user.toJSON(), student: student.toJSON() });
            case UserRoles.RECRUITER:
                const recruiter = await user.getRecruiter();
                if (!recruiter) {
                    throw new HttpError(HttpCodes.NOT_FOUND, "Recruiter not found", Error().stack);
                }
                return res.status(200).json({ user: user.toJSON(), recruiter: recruiter.toJSON() });
             
            case UserRoles.ADMIN:
                const admin = await user.getAdmin();
                if (!admin) {
                    throw new HttpError(HttpCodes.NOT_FOUND, "Admin not found", Error().stack);
                }
                return res.status(200).json({ user: user.toJSON(), admin: admin.toJSON() });
            case UserRoles.SUPER_ADMIN:
                const superAdmin = await user.getSuperAdmin();
                if (!superAdmin) {
                    throw new HttpError(HttpCodes.NOT_FOUND, "Super Admin not found", Error().stack);
                }
                return res.status(200).json({ user: user.toJSON(), superAdmin: superAdmin.toJSON() });
        }
    } catch (e) {
        next(e);
    }
}

module.exports = {login}
