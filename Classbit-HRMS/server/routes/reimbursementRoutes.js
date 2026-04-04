const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const reimbursementController = require('../controllers/reimbursementController');

// Categories
router.get('/categories', protect, reimbursementController.getCategories);
router.post('/categories', protect, authorize('Super Admin'), reimbursementController.createCategory);
router.put('/categories/:id', protect, authorize('Super Admin'), reimbursementController.updateCategory);
router.delete('/categories/:id', protect, authorize('Super Admin'), reimbursementController.deleteCategory);

// Claims
router.post('/', protect, upload.single('receipt'), reimbursementController.submitClaim);
router.get('/my', protect, reimbursementController.getMyClaims);
router.get('/all', protect, authorize('Super Admin', 'HR', 'Finance', 'Manager'), reimbursementController.getAllClaims);
router.patch('/:id/status', protect, authorize('Super Admin', 'HR', 'Finance'), reimbursementController.updateClaimStatus);

module.exports = router;
