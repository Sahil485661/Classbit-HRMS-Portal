const express = require('express');
const router = express.Router();
const { generatePayroll, getMyPayslips, getAllPayslips, lockPayroll } = require('../controllers/payrollController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/generate', authorize('Super Admin', 'HR'), generatePayroll);
router.post('/lock', authorize('Super Admin', 'HR'), lockPayroll);
router.get('/my', getMyPayslips);
router.get('/all', authorize('Super Admin', 'HR'), getAllPayslips);

module.exports = router;
