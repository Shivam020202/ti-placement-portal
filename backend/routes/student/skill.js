const express = require('express');
const router = express.Router();
const SkillController = require('../../controllers/student/skill');

router.post('/', SkillController.createSkill);
router.get('/', SkillController.getAllSkills);
router.post('/add', SkillController.addSkillsToStudent);
router.get('/student', SkillController.getSkillsByStudent);

module.exports = router;