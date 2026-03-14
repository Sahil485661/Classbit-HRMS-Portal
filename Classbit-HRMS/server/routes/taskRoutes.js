const express = require('express');
const router = express.Router();
const { createTask, getMyTasks, updateTaskStatus, updateTaskDetails, uploadTaskAttachment, getTaskAttachments } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.post('/', authorize('Super Admin', 'HR', 'Manager'), createTask);
router.get('/my', getMyTasks);
router.patch('/:id/status', updateTaskStatus);
router.put('/:id', updateTaskDetails);

// Attachment routes
router.post('/:id/attachments', upload.single('attachment'), uploadTaskAttachment);
router.get('/:id/attachments', getTaskAttachments);

module.exports = router;
