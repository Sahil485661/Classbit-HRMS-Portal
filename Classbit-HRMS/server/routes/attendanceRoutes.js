const express = require('express');
const router = express.Router();
const { clockIn, clockOut, getMyAttendance, getAllAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/clock-in', clockIn);
router.post('/clock-out', clockOut);
router.get('/my', getMyAttendance);
router.get('/all', authorize('Super Admin', 'HR', 'Manager'), getAllAttendance);

module.exports = router;
