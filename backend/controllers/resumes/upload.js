const Resume = require('../../models/resume');
const { bucket } = require('../../config/firebase');

const { v4: uuidv4 } = require('uuid');
const { ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');

async function uploadRes(req, res, next) {
  try {
    const user = res.locals.user;

    const resumes = await Resume.findAll({ where: { user: user.email } });
    if (resumes.length >= 3) {
      return res.status(400).json({ message: 'You can only upload up to 3 resumes.' });
    }

    const file = req.file;
    const name = file.originalname
    const fileName = `${user.email}/${uuidv4()}-${file.originalname}`;
    const blob = ref(bucket, fileName);

    const metadata = {
      contentType: req.file.mimetype
    };

    const snapshot = await uploadBytes(blob, file.buffer, metadata);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    const resume = await Resume.create({
      user: user.email,
      name,
      url: downloadUrl
    });

    res.status(200).json({
      resume
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function getRes(req, res) {
  try {
    const user = res.locals.user;

    const resumes = await Resume.findAll({
      where: { user: user.email }
    });

    res.status(200).json(resumes);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


async function deleteResume(req, res, next) {

  const resId = req.params.id;

  try {
    const user = res.locals.user;

    const resume = await Resume.findByPk(resId);

    if (!resume)
      throw new Error('Resume not found or unauthorized.');

    const fileRef = ref(bucket, `${resume.url}`);
    await deleteObject(fileRef);

    await resume.destroy();
    res.status(200).json({ message: 'Resume deleted successfully.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { uploadRes, getRes, deleteResume };