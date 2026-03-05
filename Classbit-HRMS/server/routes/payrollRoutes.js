const express = require('express');
const router = express.Router();
const { generatePayroll, getMyPayslips, getAllPayslips, lockPayroll } = require('../controllers/payrollController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/generate', authorize('Super Admin', 'HR'), generatePayroll);
router.post('/lock', authorize('Super Admin', 'HR'), lockPayroll);
router.post('/disburse', authorize('Super Admin', 'HR'), disbursePayroll);
router.get('/my', getMyPayslips);
router.get('/all', authorize('Super Admin', 'HR'), getAllPayslips);
router.get('/download/:id', downloadPayslip);

module.exports = router;
