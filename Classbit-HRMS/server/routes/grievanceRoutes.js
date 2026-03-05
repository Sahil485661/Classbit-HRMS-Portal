const express = require('express');
const router = express.Router();
const { submitGrievance, getMyGrievances, getAllGrievances, resolveGrievance } = require('../controllers/grievanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/submit', submitGrievance);
router.get('/my', getMyGrievances);
router.get('/all', authorize('Super Admin', 'HR', 'Manager'), getAllGrievances);
router.patch('/:id/resolve', authorize('Super Admin', 'HR'), resolveGrievance);

module.exports = router;
