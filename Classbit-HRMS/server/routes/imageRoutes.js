const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/authMiddleware');
const cloudinaryUploadMiddleware = require('../middleware/cloudinaryUploadMiddleware');
const imageController = require('../controllers/imageController');

// Rate limiting for uploads
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 uploads per windowMs
  message: { message: 'Too many upload requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// All routes are protected
router.use(protect);

router.post('/upload', uploadLimiter, cloudinaryUploadMiddleware.array('images', 5), imageController.uploadImages);
router.get('/', imageController.getImages);
router.delete('/:id', imageController.deleteImage);

module.exports = router;
