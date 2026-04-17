const express = require('express');
const router = express.Router();
const { updateSetting, getSettings, getSetupStatus, createAdmin } = require('../controllers/setupController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public Setup Routes
router.get('/status', getSetupStatus);
router.post('/create-admin', createAdmin);

// Protected Settings Routes
router.use(protect);
router.get('/', getSettings);
router.post('/', authorize('Super Admin'), updateSetting);

module.exports = router;
