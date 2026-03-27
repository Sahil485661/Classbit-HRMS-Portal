const express = require('express');
const router = express.Router();
const {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getRoles,
    createRole,
    getDepartments,
    createDepartment,
    reactivateEmployee,
    fullDeleteEmployee
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'emp_' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.use(protect);

router.get('/roles', getRoles);
router.post('/roles', authorize('Super Admin'), createRole);
router.get('/departments', getDepartments);
router.post('/departments', authorize('Super Admin'), createDepartment);

router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', authorize('Super Admin', 'HR'), upload.single('profilePicture'), createEmployee);
router.put('/:id', authorize('Super Admin', 'HR'), upload.single('profilePicture'), updateEmployee);
router.patch('/:id/reactivate', authorize('Super Admin', 'HR'), reactivateEmployee);
router.delete('/:id', authorize('Super Admin', 'HR'), deleteEmployee);
router.delete('/:id/full', authorize('Super Admin'), fullDeleteEmployee);

module.exports = router;
