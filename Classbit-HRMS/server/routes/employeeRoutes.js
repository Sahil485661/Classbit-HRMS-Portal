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
    reactivateEmployee
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/roles', getRoles);
router.post('/roles', authorize('Super Admin'), createRole);
router.get('/departments', getDepartments);
router.post('/departments', authorize('Super Admin'), createDepartment);

router.get('/', authorize('Super Admin', 'HR', 'Manager'), getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', authorize('Super Admin', 'HR'), createEmployee);
router.put('/:id', authorize('Super Admin', 'HR'), updateEmployee);
router.patch('/:id/reactivate', authorize('Super Admin', 'HR'), reactivateEmployee);
router.delete('/:id', authorize('Super Admin', 'HR'), deleteEmployee);

module.exports = router;
