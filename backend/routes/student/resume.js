const multer = require('multer');
const router = require('express').Router();
const ResController = require('../../controllers/resumes/upload');

const upload = multer({
    storage: multer.memoryStorage()
});

router.post('/upload', upload.single('resume'), ResController.uploadRes);
router.get('/', ResController.getRes);
router.delete('/:id' , ResController.deleteResume)

module.exports = router;