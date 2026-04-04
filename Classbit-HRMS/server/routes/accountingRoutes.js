const express = require('express');
const router = express.Router();
const { addTransaction, getTransactions, getProfitLoss, updateTransaction, deleteTransaction } = require('../controllers/accountingController');
const { protect, roleCheck } = require('../middleware/authMiddleware');

router.use(protect);
router.use(roleCheck('Accounting'));

router.post('/', addTransaction);
router.get('/', getTransactions);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
router.get('/profit-loss', getProfitLoss);

module.exports = router;
