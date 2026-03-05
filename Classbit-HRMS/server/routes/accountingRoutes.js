const express = require('express');
const router = express.Router();
const { addTransaction, getTransactions, getProfitLoss } = require('../controllers/accountingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Super Admin'));

router.post('/', addTransaction);
router.get('/', getTransactions);
router.get('/profit-loss', getProfitLoss);

module.exports = router;
