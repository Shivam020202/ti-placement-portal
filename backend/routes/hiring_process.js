const express = require("express");
const router = express.Router();
const HiringProcessController = require('../controllers/hiring_process/hiring_process');

router.post('/', HiringProcessController.createHiringProcess);
router.get('/:id', HiringProcessController.getHiringProcessById);
router.get('/job/:jobId', HiringProcessController.getHiringProcessesByJobId);

module.exports = router;