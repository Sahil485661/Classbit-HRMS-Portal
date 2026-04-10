const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const meetingController = require('../controllers/meetingController');

router.use(protect);

router.get('/', meetingController.getMeetings);
router.post('/', authorize('Super Admin', 'HR', 'Manager'), meetingController.createMeeting);
router.put('/:id', authorize('Super Admin', 'HR', 'Manager'), meetingController.updateMeeting);
router.post('/:id/send-email', authorize('Super Admin', 'HR', 'Manager'), meetingController.sendMeetingEmail);
router.delete('/:id', authorize('Super Admin', 'HR', 'Manager'), meetingController.deleteMeeting);
router.post('/:id/reaction', meetingController.reactToMeeting);

module.exports = router;
