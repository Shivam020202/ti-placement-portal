const router = require("express").Router();
const ResController = require("../../controllers/resumes/upload");

router.get("/download/:id", ResController.downloadResumeForAdmin);

module.exports = router;
