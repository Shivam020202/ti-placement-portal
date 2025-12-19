const { OAuth2Client } = require("google-auth-library");
const { User } = require("../models");
const { getToken, HttpCodes, HttpError } = require("../config/http");
const { firebaseAdmin } = require("../config/firebase");

const userExists = async (req, res, next) => {
  const token = getToken(req);

  try {
    if (!token) {
      throw new HttpError(
        HttpCodes.UNAUTHORIZED,
        "No Token Provided",
        Error().stack
      );
    }

    let email;

    try {
      // Try Firebase verification first
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      console.log("Token verified successfully for:", decodedToken.email);
      email = decodedToken.email;
    } catch (firebaseError) {
      console.log("Firebase verification failed:", firebaseError.message);

      // DEVELOPMENT FALLBACK: Decode JWT manually
      // WARNING: This bypasses security checks - for development only!
      if (process.env.NODE_ENV === "development") {
        try {
          const parts = token.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(
              Buffer.from(parts[1], "base64").toString()
            );
            email = payload.email;
            console.log("DEV MODE: Using decoded token email:", email);
          } else {
            throw new Error("Invalid JWT format");
          }
        } catch (decodeError) {
          throw firebaseError; // Re-throw original error if decode fails
        }
      } else {
        throw firebaseError;
      }
    }

    const user = await User.findByPk(email);
    console.log(
      "User lookup result:",
      user ? `Found: ${user.email}` : "User not found"
    );

    if (!user) {
      if (req.path === "/login") {
        throw new HttpError(
          HttpCodes.NOT_FOUND,
          "User not found",
          Error().stack
        );
      }
      throw new HttpError(
        HttpCodes.UNAUTHORIZED,
        "User does not exist",
        Error().stack
      );
    }

    res.locals.user = user;
    return next();
  } catch (error) {
    // Handle Firebase specific errors
    if (error.code === "auth/id-token-expired") {
      return next(
        new HttpError(
          HttpCodes.UNAUTHORIZED,
          "Token has expired. Please login again.",
          error.stack
        )
      );
    }
    if (
      error.code === "auth/argument-error" ||
      error.message?.includes("Decoding Firebase ID token failed")
    ) {
      return next(
        new HttpError(
          HttpCodes.UNAUTHORIZED,
          "Invalid authentication token. Please login again.",
          error.stack
        )
      );
    }
    next(error);
  }
};

module.exports = userExists;
