const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sendMessage, getInbox, getOutbox, getConversation, markAsRead } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Ensure uploads/messages directory exists before multer tries to write to it
const uploadDir = path.join(__dirname, '..', 'uploads', 'messages');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Sanitize original filename (remove spaces, special chars)
        const safeName = file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
        cb(null, `${Date.now()}-${safeName}`);
    }
});

// Allow common file types — images, PDFs, docs, zip
const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|pdf|doc|docx|xls|xlsx|txt|zip|rar/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowed.test(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`File type .${ext} not allowed`), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

router.use(protect);

router.post('/', upload.single('attachment'), sendMessage);
router.get('/inbox', getInbox);
router.get('/outbox', getOutbox);
router.get('/:recipientId', getConversation);
router.patch('/:id/read', markAsRead);

module.exports = router;
