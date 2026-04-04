const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup dynamic destinations
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Automatically route to reimbursements folder if endpoint matches
        let folderName = 'uploads';
        if (req.originalUrl && req.originalUrl.includes('/reimbursements')) {
            folderName = 'uploads/reimbursements';
        }
        
        const finalDir = path.join(__dirname, '..', folderName);
        if (!fs.existsSync(finalDir)) {
            fs.mkdirSync(finalDir, { recursive: true });
        }
        
        cb(null, finalDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// File filter (optional: restrict to images and docs for safety)
const fileFilter = (req, file, cb) => {
    // You can customize allowed types here
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only standard documents and images are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    // fileFilter: fileFilter // Optional: enable to restrict types
});

module.exports = upload;
