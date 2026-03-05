const { PayrollRecord, SalaryComponent, Employee, Attendance } = require('../models');
const { Op } = require('sequelize');

const generatePayroll = async (req, res) => {
    try {
        const { month, year } = req.body;

        // Get all active employees with their salary components
        const employees = await Employee.findAll({
            where: { status: 'Active' },
            include: [SalaryComponent]
        });

        const results = [];

        for (const emp of employees) {
            if (!emp.SalaryComponent) continue;

            // Pad month for ISO format (e.g. 02 instead of 2)
            const paddedMonth = month.toString().padStart(2, '0');
            const attendanceCount = await Attendance.count({
                where: {
                    employeeId: emp.id,
                    date: {
                        [Op.between]: [`${year}-${paddedMonth}-01`, `${year}-${paddedMonth}-31`]
                    },
                    status: 'Present'
                }
            });

            const { baseSalary, allowances, deductions, payType } = emp.SalaryComponent;

            let grossSalary = parseFloat(baseSalary);
            // add allowances
            Object.values(allowances).forEach(val => grossSalary += parseFloat(val));

            let totalDeductions = 0;
            Object.values(deductions).forEach(val => totalDeductions += parseFloat(val));

            // Simple logic for hourly/task-based could be added here
            // For now, assume monthly base

            const netSalary = grossSalary - totalDeductions;

            // Create or update record
            const [record, created] = await PayrollRecord.findOrCreate({
                where: { employeeId: emp.id, month, year },
                defaults: {
                    grossSalary,
                    totalDeductions,
                    netSalary,
                    status: 'Generated'
                }
            });

            if (!created) {
                await record.update({ grossSalary, totalDeductions, netSalary });
            }

            results.push(record);
        }

        res.json({ message: `Payroll generated for ${results.length} employees`, records: results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyPayslips = async (req, res) => {
    try {
        const { employeeId } = req.user;
        const records = await PayrollRecord.findAll({
            where: { employeeId },
            order: [['year', 'DESC'], ['month', 'DESC']]
        });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllPayslips = async (req, res) => {
    try {
        const records = await PayrollRecord.findAll({
            include: [{ model: Employee }],
            order: [['year', 'DESC'], ['month', 'DESC']]
        });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const lockPayroll = async (req, res) => {
    try {
        const { month, year } = req.body;
        await PayrollRecord.update(
            { status: 'Locked' },
            { where: { month, year } }
        );
        res.json({ message: 'Payroll locked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    generatePayroll,
    getMyPayslips,
    getAllPayslips,
    lockPayroll
};
