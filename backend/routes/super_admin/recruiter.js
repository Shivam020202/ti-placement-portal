const express = require('express');
const router = express.Router();
const {
    getAllRecruiters,
    deleteRecruiter
} = require("../../controllers/super_admin/recruiter");

router.get('/' , getAllRecruiters);
router.delete('/:recruiterEmail' , deleteRecruiter);

module.exports = router; 
