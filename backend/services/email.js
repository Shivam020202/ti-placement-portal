const nodemailer = require('nodemailer');


async function sendEmail(email, role, next) {

    try {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Invitation to be a ' + role,
            text: 'You\'ve been invited to be a ' + role
        };
        return await transporter.sendMail(mailOptions);

    } catch (error) {
        next(error);
    }
}

module.exports = sendEmail