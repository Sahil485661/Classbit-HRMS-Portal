const express = require('express');
const router = express.Router();
const { getLogs, purgeLogs } = require('../controllers/activityController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Super Admin'));

router.get('/', getLogs);
router.delete('/purge', purgeLogs);

module.exports = router;
