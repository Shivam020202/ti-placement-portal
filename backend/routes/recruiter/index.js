const express = require('express');
const { getAllBranches } = require('../../controllers/super_admin/branch');
const router = express.Router();

router.get('/branches' , getAllBranches);

module.exports = router;