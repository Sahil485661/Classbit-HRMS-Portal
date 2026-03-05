const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createJob, getJobs, applyForJob, getCandidates, updateCandidateStatus } = require('../controllers/recruitmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/resumes/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.get('/jobs', getJobs);
router.post('/apply', upload.single('resume'), applyForJob);

router.use(protect);
router.use(authorize('Super Admin', 'HR'));

router.post('/jobs', createJob);
router.get('/candidates', getCandidates);
router.patch('/candidates/:id', updateCandidateStatus);

module.exports = router;
