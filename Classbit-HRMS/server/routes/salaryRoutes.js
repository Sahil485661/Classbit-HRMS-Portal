const express = require('express');
const router = express.Router();
const { SalaryComponent } = require('../models');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// GET my own salary structure (any logged-in employee)
router.get('/my', async (req, res) => {
    try {
        const employeeId = req.user?.employeeId;
        if (!employeeId) return res.json(null);
        const comp = await SalaryComponent.findOne({ where: { employeeId } });
        res.json(comp || null);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET salary structure for a specific employee (HR/Manager/Admin, or self)
router.get('/:employeeId', async (req, res) => {
    try {
        const requesterId = req.user?.employeeId;
        const targetId    = req.params.employeeId;
        const role        = req.user?.role;

        const canAccess = ['Super Admin', 'HR', 'Manager', 'Finance'].includes(role) || requesterId === targetId;
        if (!canAccess) return res.status(403).json({ message: 'Access denied' });

        const comp = await SalaryComponent.findOne({ where: { employeeId: targetId } });
        res.json(comp || null);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE or UPDATE salary structure for an employee (HR/Manager/Admin only)
router.post('/:employeeId', authorize('Super Admin', 'HR', 'Manager'), async (req, res) => {
    try {
        const { baseSalary, payType, allowances, deductions, currency } = req.body;
        const employeeId = req.params.employeeId;

        const [comp, created] = await SalaryComponent.findOrCreate({
            where: { employeeId },
            defaults: { baseSalary, payType, allowances, deductions, currency }
        });

        if (!created) {
            await comp.update({ baseSalary, payType, allowances, deductions, currency });
        }

        res.json(comp);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
