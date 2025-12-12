const router = require('express').Router();
const skillRouter = require('./skill');
const resumeRouter = require('./resume');

router.get('/', (req, res, next) => {
    res.status(200).json({ data: res.locals.std });
})

router.use('/skill', skillRouter);

router.use('/resumes', resumeRouter);

router.use('/', (req, res) => {
    res.send('Welcome to the student API');
})

module.exports = router;