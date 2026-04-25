const express = require('express');
const router = express.Router();
const { updateSetting, getSettings, getSetupStatus, completeSetup, getCompany, updateCompany } = require('../controllers/setupController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public Setup Routes
router.get('/status', getSetupStatus);
router.post('/complete', upload.single('logo'), completeSetup);
router.get('/company', getCompany);

// Protected Settings Routes
router.use(protect);
router.get('/', getSettings);
router.post('/', authorize('Super Admin'), updateSetting);
router.post('/company', authorize('Super Admin'), updateCompany);

module.exports = router;
