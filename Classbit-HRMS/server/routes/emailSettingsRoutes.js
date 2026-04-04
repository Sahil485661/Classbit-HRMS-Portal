const express = require('express');
const router = express.Router();
const { getTemplates, updateTemplate, getLogs } = require('../controllers/emailSettingsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
// Assuming Email Management is restricted to Super Admin or someone with specific Settings role
router.use(authorize('Super Admin'));

router.get('/templates', getTemplates);
router.put('/templates/:id', updateTemplate);
router.get('/logs', getLogs);

module.exports = router;
