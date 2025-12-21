const multer = require("multer");
const router = require("express").Router();
const ResController = require("../../controllers/resumes/upload");

// Configure multer for memory storage (file buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed"), false);
    }
  },
});

// Upload a new resume
router.post("/upload", upload.single("resume"), ResController.uploadRes);

// Get all resumes for the current user
router.get("/", ResController.getRes);

// Download/view a specific resume
router.get("/download/:id", ResController.downloadResume);

// Delete a resume
router.delete("/:id", ResController.deleteResume);

module.exports = router;
