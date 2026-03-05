const express = require('express');
const router = express.Router();
const { addPerformance, getEmployeePerformance, getMyPerformance } = require('../controllers/performanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('Super Admin', 'HR', 'Manager'), addPerformance);
router.get('/my', getMyPerformance);
router.get('/:employeeId', authorize('Super Admin', 'HR', 'Manager'), getEmployeePerformance);

module.exports = router;
