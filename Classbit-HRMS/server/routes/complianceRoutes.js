const express = require('express');
const router = express.Router();
const { protect, authorize, roleCheck } = require('../middleware/authMiddleware');
const { Setting } = require('../models');

// Define default structure for new installs
const DEFAULT_COMPLIANCE = {
    pf: { enabled: true, employeePercent: 12, employerPercent: 12, basicCap: 15000 },
    esi: { enabled: true, employeePercent: 0.75, employerPercent: 3.25, maxGross: 21000 },
    tds: { enabled: true, percent: 10, monthlyThreshold: 50000 },
    pt: {
        enabled: true,
        slabs: [
            { min: 0, max: 7500, deduction: 0 },
            { min: 7501, max: 10000, deduction: 75 },
            { min: 10001, max: 20000, deduction: 150 },
            { min: 20001, max: 999999999, deduction: 200 }
        ]
    }
};

router.get('/', protect, roleCheck('Compliance'), async (req, res) => {
    try {
        let setting = await Setting.findOne({ where: { key: 'statutory_compliance' } });
        
        if (!setting) {
            setting = await Setting.create({
                key: 'statutory_compliance',
                category: 'Payroll',
                value: DEFAULT_COMPLIANCE
            });
            return res.json(DEFAULT_COMPLIANCE);
        }
        
        const configVal = typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
        res.json(configVal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/', protect, roleCheck('Compliance'), async (req, res) => {
    try {
        const payload = req.body;
        
        let setting = await Setting.findOne({ where: { key: 'statutory_compliance' } });
        if (setting) {
            await setting.update({ value: payload });
        } else {
            setting = await Setting.create({
                key: 'statutory_compliance',
                category: 'Payroll',
                value: payload
            });
        }
        
        const savedVal = typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
        res.json({ message: 'Statutory compliance rules updated successfully', config: savedVal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
