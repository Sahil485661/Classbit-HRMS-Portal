const express = require('express');
const router = express.Router();
const { createNotice, getActiveNotices, deleteNotice } = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('Super Admin', 'HR'), createNotice);
router.get('/', getActiveNotices);
router.delete('/:id', authorize('Super Admin', 'HR'), deleteNotice);

module.exports = router;
