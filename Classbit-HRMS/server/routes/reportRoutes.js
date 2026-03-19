const express = require('express');
const router = express.Router();
const { getReportData } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/:type', authorize('Super Admin', 'HR'), getReportData);

module.exports = router;
