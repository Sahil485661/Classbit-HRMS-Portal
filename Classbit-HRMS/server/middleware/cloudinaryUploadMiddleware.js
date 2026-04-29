const multer = require('multer');

// Use memory storage to pipe streams directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.'), false);
  }
};

const cloudinaryUploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit per the requirements
  },
  fileFilter: fileFilter
});

module.exports = cloudinaryUploadMiddleware;
