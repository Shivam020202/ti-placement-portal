const Resume = require("../../models/resume");

const MAX_RESUMES_PER_USER = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max file size

async function uploadRes(req, res, next) {
  try {
    const user = res.locals.user;

    // Check if user has reached the resume limit
    const resumes = await Resume.findAll({ where: { user: user.email } });
    if (resumes.length >= MAX_RESUMES_PER_USER) {
      return res.status(400).json({
        message: `You can only upload up to ${MAX_RESUMES_PER_USER} resumes. Please delete an existing resume to upload a new one.`,
      });
    }

    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return res
        .status(400)
        .json({ message: "Only PDF, DOC, and DOCX files are allowed" });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return res
        .status(400)
        .json({ message: "File size must be less than 5MB" });
    }

    // Create a display name (user-provided or original filename)
    const displayName = req.body.name || file.originalname;

    // Store the resume in the database
    const resume = await Resume.create({
      user: user.email,
      name: displayName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileData: file.buffer,
      fileSize: file.size,
      url: null, // New resumes don't use URL
    });

    // Return resume data without the file content (it's large)
    res.status(200).json({
      resume: {
        id: resume.id,
        name: resume.name,
        originalName: resume.originalName,
        mimeType: resume.mimeType,
        fileSize: resume.fileSize,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    next(error);
  }
}

async function getRes(req, res) {
  try {
    const user = res.locals.user;

    const resumes = await Resume.findAll({
      where: { user: user.email },
      attributes: [
        "id",
        "name",
        "originalName",
        "mimeType",
        "fileSize",
        "url",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    // Transform resumes to include whether they are stored in DB or Firebase
    const transformedResumes = resumes.map((resume) => ({
      id: resume.id,
      name: resume.name,
      originalName: resume.originalName || resume.name,
      mimeType: resume.mimeType || "application/pdf",
      fileSize: resume.fileSize || 0,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
      // If resume has url field, it's an old Firebase-stored resume
      isLegacy: !!resume.url,
      downloadUrl: resume.url || null,
    }));

    res.status(200).json(transformedResumes);
  } catch (error) {
    console.error("Get resumes error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Download/view a specific resume
async function downloadResume(req, res, next) {
  const resId = req.params.id;

  try {
    const user = res.locals.user;

    const resume = await Resume.findOne({
      where: { id: resId, user: user.email },
    });

    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or unauthorized." });
    }

    // Check if it's an old Firebase-stored resume
    if (resume.url && !resume.fileData) {
      // Redirect to the Firebase URL for old resumes
      return res.redirect(resume.url);
    }

    // For new database-stored resumes
    if (!resume.fileData) {
      return res.status(404).json({ message: "Resume file data not found." });
    }

    // Set appropriate headers for file download
    res.setHeader("Content-Type", resume.mimeType || "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${resume.originalName || resume.name}"`
    );
    if (resume.fileSize) {
      res.setHeader("Content-Length", resume.fileSize);
    }

    // Send the file data
    res.send(resume.fileData);
  } catch (error) {
    console.error("Download resume error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Download/view a specific resume (admin/super-admin)
async function downloadResumeForAdmin(req, res, next) {
  const resId = req.params.id;

  try {
    const resume = await Resume.findByPk(resId);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found." });
    }

    // Check if it's an old Firebase-stored resume
    if (resume.url && !resume.fileData) {
      return res.redirect(resume.url);
    }

    if (!resume.fileData) {
      return res.status(404).json({ message: "Resume file data not found." });
    }

    res.setHeader("Content-Type", resume.mimeType || "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${resume.originalName || resume.name}"`
    );
    if (resume.fileSize) {
      res.setHeader("Content-Length", resume.fileSize);
    }

    res.send(resume.fileData);
  } catch (error) {
    console.error("Admin download resume error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteResume(req, res, next) {
  const resId = req.params.id;

  try {
    const user = res.locals.user;

    const resume = await Resume.findOne({
      where: { id: resId, user: user.email },
    });

    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or unauthorized." });
    }

    // Note: For old Firebase-stored resumes, we just delete the DB record
    // The Firebase file will remain (can be cleaned up manually if needed)
    await resume.destroy();
    res.status(200).json({ message: "Resume deleted successfully." });
  } catch (error) {
    console.error("Delete resume error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  uploadRes,
  getRes,
  downloadResume,
  downloadResumeForAdmin,
  deleteResume,
};
