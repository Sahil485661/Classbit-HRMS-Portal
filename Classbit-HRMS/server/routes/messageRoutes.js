const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { sendMessage, getInbox, getOutbox, getConversation, markAsRead } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/messages/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.use(protect);

router.post('/', upload.single('attachment'), sendMessage);
router.get('/inbox', getInbox);
router.get('/outbox', getOutbox);
router.get('/:recipientId', getConversation);
router.patch('/:id/read', markAsRead);

module.exports = router;
