const express = require('express');
const router = express.Router();
const { 
    getDashboardMy, 
    getDashboardAll, 
    addPerformance, 
    submitSelfAppraisal,
    addObjective,
    updateObjective,
    addFeedback
} = require('../controllers/performanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Dashboards
router.get('/dashboard/my', getDashboardMy);
router.get('/dashboard/all', authorize('Super Admin', 'HR', 'Manager'), getDashboardAll);

// Appraisals
router.post('/appraisal', authorize('Super Admin', 'HR', 'Manager'), addPerformance);
router.put('/appraisal/self', submitSelfAppraisal);

// OKRs
router.post('/okr', addObjective);
router.put('/okr/:id', updateObjective);

// Feedback
router.post('/feedback', addFeedback);

module.exports = router;
