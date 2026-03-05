const {
    Employee, Department, Attendance, Grievance,
    Task, Transaction, Candidate, User
} = require('../models');
const { Op } = require('sequelize');

const getAdminStats = async (req, res) => {
    try {
        const employeeCount = await Employee.count();
        const grievanceCount = await Grievance.count({ where: { status: 'Open' } });
        const jobSeekerCount = await Candidate.count();
        const activeTasks = await Task.count({ where: { status: { [Op.ne]: 'Completed' } } });

        // Payroll sum for current month
        const totalPayroll = await Transaction.sum('amount', {
            where: { type: 'Expense', category: 'Payroll' }
        }) || 0;

        const totalExpenses = await Transaction.sum('amount', {
            where: { type: 'Expense' }
        }) || 0;

        // Real Attendance Trend for last 7 days
        const attendanceData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-CA');
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

            const present = await Attendance.count({ where: { date: dateStr, status: 'Present' } });
            const absent = await Attendance.count({ where: { date: dateStr, status: 'Absent' } });

            attendanceData.push({ name: dayName, present, absent });
        }

        const maleCount = await Employee.count({ where: { gender: 'Male' } });
        const femaleCount = await Employee.count({ where: { gender: 'Female' } });
        const otherCount = await Employee.count({ where: { gender: 'Other' } });

        res.json({
            summary: [
                { name: 'Employees', value: employeeCount, module: 'employees' },
                { name: 'Grievances', value: grievanceCount, module: 'grievance' },
                { name: 'Job Seekers', value: jobSeekerCount, module: 'recruitment' },
                { name: 'Active Work', value: activeTasks, module: 'work' },
                { name: 'Total Expenses', value: `$${totalExpenses.toLocaleString()}`, module: 'accounting' }
            ],
            attendanceTrend: attendanceData,
            genderDistribution: [
                { name: 'Male', value: maleCount },
                { name: 'Female', value: femaleCount },
                { name: 'Other', value: otherCount }
            ]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAdminStats };
