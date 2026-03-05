const express = require('express');
const router = express.Router();
const { createTask, getMyTasks, updateTaskStatus } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('Super Admin', 'HR', 'Manager'), createTask);
router.get('/my', getMyTasks);
router.patch('/:id/status', updateTaskStatus);

module.exports = router;
