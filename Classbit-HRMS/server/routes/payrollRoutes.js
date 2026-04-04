const express = require('express');
const router = express.Router();
const {
    generatePayroll,
    updatePayrollStatus,
    exportBankFile,
    getMyPayslips,
    getAllPayslips,
    lockPayroll
} = require('../controllers/payrollController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// HR: Generate draft payroll for a month
router.post('/generate', authorize('Super Admin', 'HR'), generatePayroll);

// Finance/Manager: Transition status (verify → approve → pay)
router.patch('/:id/status', authorize('Super Admin', 'HR', 'Manager', 'Finance'), updatePayrollStatus);

// Manager/Admin: Export bank CSV file
router.get('/export/bank', authorize('Super Admin', 'Manager', 'Finance'), exportBankFile);

// All authenticated users: Own payslips
router.get('/my', getMyPayslips);

// HR/Admin: All payslips (with optional filters)
router.get('/all', authorize('Super Admin', 'HR', 'Manager', 'Finance'), getAllPayslips);

// Legacy lock endpoint
router.post('/lock', authorize('Super Admin', 'HR'), lockPayroll);

module.exports = router;
