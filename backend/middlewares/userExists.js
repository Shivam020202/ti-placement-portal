const { OAuth2Client } = require("google-auth-library");
const { User } = require('../models');
const { getToken, HttpCodes, HttpError } = require('../config/http');
const { firebaseAdmin } = require("../config/firebase");

const userExists = async (req, res, next) => {

  const token = getToken(req);

  try {
    if (!token) {
      throw new HttpError(HttpCodes.UNAUTHORIZED, "No Token Provided", Error().stack);
    }

    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    const user = await User.findByPk(decodedToken.email);

    if (!user) {
      if (req.path === "/login") {
        throw new HttpError(HttpCodes.NOT_FOUND, "User not found", Error().stack);
      }
      throw new HttpError(HttpCodes.UNAUTHORIZED, "User does not exist", Error().stack);
    }

    res.locals.user = user;
    return next();
  } catch (error) {
    next(error);
  }
}

module.exports = userExists;
