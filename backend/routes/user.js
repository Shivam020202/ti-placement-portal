const express = require('express');
const { getUserMetaData, getUsersMetaData, getRelatedUsersMetaData } = require('../controllers/user');
const router = express.Router();




router.get('/', getUsersMetaData)

router.get('/related/:slug', getRelatedUsersMetaData)

router.get('/:email', getUserMetaData);


module.exports = router;