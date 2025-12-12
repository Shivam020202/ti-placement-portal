const express = require('express');
const router = express.Router();
const StudentController = require('../../controllers/super_admin/student');

router.get('/:id' , StudentController.getStdById);
router.get('/job/:jobId', StudentController.getStudentsAppliedToJob);
router.get('/all/:limit' , StudentController.getAllStds );
router.get('/all', StudentController.getAllJobsAndStudents);
router.delete('/:jobId/:studentId', StudentController.deleteStudentFromJob);

module.exports = router;