const express = require('express');
const router = express.Router();
const { applyLoan, getMyLoans, getAllLoans, updateLoanStatus } = require('../controllers/loanController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/apply', applyLoan);
router.get('/my', getMyLoans);
router.get('/all', authorize('Super Admin', 'HR'), getAllLoans);
router.patch('/:id/status', authorize('Super Admin', 'HR'), updateLoanStatus);

module.exports = router;
