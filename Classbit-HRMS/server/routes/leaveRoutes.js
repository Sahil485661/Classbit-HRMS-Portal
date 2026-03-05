const express = require('express');
const router = express.Router();
const { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus } = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/apply', applyLeave);
router.get('/my', getMyLeaves);
router.get('/all', authorize('Super Admin', 'HR', 'Manager'), getAllLeaves);
router.patch('/:id/status', authorize('Super Admin', 'HR', 'Manager'), updateLeaveStatus);

module.exports = router;
