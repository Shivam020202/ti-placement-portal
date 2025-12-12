const {HttpError, HttpCodes} = require('../config/http');

const isStudent = async (req, res, next) => {
  const user = res.locals.user;
  const student = await user.getStudent();
  if (!student) {
    return next(new HttpError(HttpCodes.UNAUTHORIZED, 'This user is not a student', Error().stack));
  }
  res.locals.student = student;
  return next();
}

module.exports = isStudent;