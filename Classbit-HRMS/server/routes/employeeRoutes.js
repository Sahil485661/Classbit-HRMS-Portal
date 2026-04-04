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
    updateRole,
    getDepartments,
    createDepartment,
    reactivateEmployee,
    fullDeleteEmployee,
    getDeletedEmployees,
    adminForcePasswordReset
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
router.put('/roles/:id', authorize('Super Admin'), updateRole);
router.get('/departments', getDepartments);
router.post('/departments', authorize('Super Admin'), createDepartment);

router.get('/', getAllEmployees);
router.get('/history', getDeletedEmployees);
router.get('/:id', getEmployeeById);
router.post('/', authorize('Super Admin', 'HR'), upload.single('profilePicture'), createEmployee);
router.put('/:id', authorize('Super Admin', 'HR'), upload.single('profilePicture'), updateEmployee);
router.patch('/:id/reactivate', authorize('Super Admin', 'HR'), reactivateEmployee);
router.post('/:id/force-password-reset', authorize('Super Admin'), adminForcePasswordReset);
router.delete('/:id', authorize('Super Admin'), deleteEmployee);
router.delete('/:id/full', authorize('Super Admin'), fullDeleteEmployee);

module.exports = router;
