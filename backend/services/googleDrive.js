const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { GoogleAuth } = require('google-auth-library');
const credentials = require('../credentials.json');

// const oauth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_DRIVE_CLIENT_ID,
//     process.env.GOOGLE_DRIVE_CLIENT_SECRET,
//     process.env.GOOGLE_DRIVE_REDIRECT_URI
// )

const auth = new GoogleAuth({
    credentials,
    scopes: 'https://www.googleapis.com/auth/drive'
})

const uploadFileToDrive = async (filePath, fileName) => {

    const drive = google.drive({ version: 'v3', auth });
    const fileMetadata = {
        name: fileName,
    };
    const media = {
        mimeType: 'application/pdf', // Adjust MIME type as needed
        body: fs.createReadStream(filePath),
    };
    const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
    });

    console.log('response is' , response.data.id);
    const link = await getFileFromDrive(response.data.id);
    console.log('link is ' , link)
    return link.webViewLink;
};


async function getFileFromDrive(fileId) {

    try {
        const drive = google.drive({ version: 'v3', auth });
        await drive.permissions.create({
            fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });

        const result = await drive.files.get({
            fileId,
            fields: 'webViewLink, webContentLink'
        })

        return result.data;
    } catch (error) {
        console.log(error);
    }

}


module.exports = { uploadFileToDrive };
