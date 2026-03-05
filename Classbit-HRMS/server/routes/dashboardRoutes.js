const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('Super Admin', 'HR', 'Manager'), getAdminStats);

module.exports = router;
