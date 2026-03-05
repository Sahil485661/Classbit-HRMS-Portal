const express = require('express');
const router = express.Router();
const { updateSetting, getSettings } = require('../controllers/setupController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getSettings);
router.post('/', authorize('Super Admin'), updateSetting);

module.exports = router;
