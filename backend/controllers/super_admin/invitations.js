const { Admin, SuperAdmin, User, Company } = require("../../models");
const { HttpError, HttpCodes, respond } = require("../../config/http");
const { UserRoles } = require("../../config/enums");
const Sequelize = require("sequelize");
const sendEmail = require("../../services/email");

const getAllInvitedUsers = async (req, res, next) => {
  const user = res.locals.user;
  const limit = req.query.limit;

  try {
    const admins = await user.getAddedUsers({ limit: limit ?? 10 });
    respond(res, HttpCodes.OK, "Admins found", admins);
  } catch (error) {
    next(error);
  }
};

const invite = async (req, res, next) => {
  const { email, firstName, lastName, role } = req.body;
  const nodemailer = require("nodemailer");
  console.log(role);
  if (role.toLowerCase() == UserRoles.STUDENT.toLowerCase()) {
    next(
      new HttpError(
        HttpCodes.BAD_REQUEST,
        "Inviting a student is currently not allowed!",
        Error().stack,
      ),
    );
  }
  // TODO: Replace with plexus' link
  const link = process.env.BASE_URI;

  try {
    // Create a user with the role
    const user = res.locals.user;
    const createdUser = await user.createAddedUser({
      email: email,
      role: role,
      firstName: firstName,
      lastName: lastName,
    });
    if (!createdUser) {
      throw new HttpError(
        HttpCodes.BAD_REQUEST,
        "User already exists",
        Error().stack,
      );
    }

    switch (role) {
      case UserRoles.ADMIN:
        await createdUser.createAdmin();
        break;
      case UserRoles.SUPER_ADMIN:
        await createdUser.createSuperAdmin();
        break;
      default:
        throw new HttpError(
          HttpCodes.BAD_REQUEST,
          "Invalid role",
          Error().stack,
        );
    }

    // Send invitation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Invitation to be a " + role,
      text:
        "You've been invited to be a " + role,
    };
    await transporter.sendMail(mailOptions);
    respond(res, HttpCodes.OK, "User invited", user);
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      next(
        new HttpError(
          HttpCodes.BAD_REQUEST,
          "User already exists",
          error.stack,
        ),
      );
    }
    next(error);
  }
};

async function inviteRecruiter(req, res, next) {
  let { companyId, email, firstName, lastName } = req.body;

  if( !firstName) firstName = 'Parth';
  if( !lastName) lastName = 'Kapoor';

  try {
    const company = await Company.findByPk(companyId);
    if (!company) throw new Error("Invalid Company Id");

    const user = res.locals.user;
    const createdUser = await user.createAddedUser({
      email: email,
      role: "recruiter",
      firstName: firstName,
      lastName: lastName,
    });
    if (!createdUser) {
      throw new HttpError(
        HttpCodes.BAD_REQUEST,
        "User already exists",
        Error().stack,
      );
    }

    const recruiter = await createdUser.createRecruiter({
      companyId: companyId,
    });

    const sentEmail = await sendEmail(email, "Recruiter" , next);
    console.log(sentEmail);
    respond(res, HttpCodes.OK, "Recruiter invited", recruiter);
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      next(
        new HttpError(
          HttpCodes.BAD_REQUEST,
          "Recruiter already exists",
          error.stack,
        ),
      );
    }
    next(error);
  }
}

module.exports = {
  invite,
  getAllInvitedUsers,
  inviteRecruiter,
};
