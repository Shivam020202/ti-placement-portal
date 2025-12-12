const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
const { googleToken, User } = require('../models');
const { UserRoles } = require("../config/enums.js");
const { HttpError, HttpCodes, respond } = require("../config/http.js");
const crypto = require('crypto');

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const googleLogin = (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  req.session.state = state;

  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/calendar'
    ],
    state: state,
  });
  res.redirect(authorizeUrl);
}

const googleCallback = async (req, res, next) => {
  const { code, state } = req.query;
  const user = res.locals.user;

  try {
    if (state !== req.session.state) {
      console.error('State validation failed');
      return respond(res, HttpCodes.BAD_REQUEST, 'State validation failed');
    }

    // Getting tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const existingToken = await googleToken.findOne({ where: { user: user.email } });

    if (existingToken) {
      // Update existing token
      await existingToken.update({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || existingToken.refreshToken
      });
    } else {
      // Create new token
      await googleToken.create({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        user: user.email
      });
    }

    return respond(res, HttpCodes.OK, 'Google authentication successful', { redirectUrl: `${process.env.FRONTEND_URL}/auth/success` });
  } catch (error) {
    console.error('Error during Google OAuth callback:', error);
    next(new HttpError(HttpCodes.INTERNAL_SERVER_ERROR, 'Google OAuth failed', error.stack));
  }
}

const refreshGoogleToken = async (userEmail) => {
  try {
    const tokenData = await googleToken.findOne({ where: { user: userEmail } });
    if (!tokenData) {
      throw new HttpError(HttpCodes.NOT_FOUND, 'Token not found');
    }

    oauth2Client.setCredentials({
      refresh_token: tokenData.refreshToken
    });

    const { credentials } = await oauth2Client.refreshAccessToken();
    if (!credentials) {
      throw new HttpError(HttpCodes.INTERNAL_SERVER_ERROR, 'Failed to refresh token');
    }

    await googleToken.update(
      {
        accessToken: credentials.access_token,
        refreshToken: credentials.refresh_token || tokenData.refreshToken
      },
      {
        where: { user: userEmail }
      }
    );

    return credentials.access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw new HttpError(HttpCodes.INTERNAL_SERVER_ERROR, 'Failed to refresh token', error.stack);
  }
}

const createCalendarEvent = async (userEmail, eventData) => {
  try {
    let tokenData = await googleToken.findOne({ where: { user: userEmail } });
    if (!tokenData) {
      throw new HttpError(HttpCodes.NOT_FOUND, 'Token not found');
    }

    // Set credentials
    oauth2Client.setCredentials({
      access_token: tokenData.accessToken,
      refresh_token: tokenData.refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const event = {
      summary: eventData.title,
      description: eventData.description,
      start: { dateTime: eventData.startTime },
      end: { dateTime: eventData.endTime },
      attendees: eventData.attendees || [],
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return response.data;
  } catch (error) {
    // Check if the error is due to invalid credentials
    if (error.response && error.response.status === 401) {
      try {
        // Refresh the access token
        const newAccessToken = await refreshGoogleToken(userEmail);

        // Update the access token in the tokenData object
        await googleToken.update(
          { accessToken: newAccessToken },
          { where: { user: userEmail } }
        );

        // Retry the calendar event creation with the new access token
        oauth2Client.setCredentials({ access_token: newAccessToken });
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        const response = await calendar.events.insert({
          calendarId: 'primary',
          requestBody: event,
        });

        return response.data;
      } catch (refreshError) {
        throw new HttpError(HttpCodes.UNAUTHORIZED, 'Failed to refresh token', refreshError.stack);
      }
    } else {
      console.error('Error creating calendar event:', error);
      throw new HttpError(HttpCodes.INTERNAL_SERVER_ERROR, 'Failed to create calendar event', error.stack);
    }
  }
}

// Fixed typo in function name (Calender → Calendar)
module.exports = { createCalendarEvent, googleLogin, googleCallback, refreshGoogleToken };