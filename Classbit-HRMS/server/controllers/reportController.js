const { Employee, Department, Attendance, PayrollRecord, Performance, User } = require('../models');

const getReportData = async (req, res) => {
    try {
        const { type } = req.params;
        let data = [];

        if (type === 'attendance') {
            const records = await Attendance.findAll({
                include: [{ model: Employee, attributes: ['firstName', 'lastName', 'employeeId'] }]
            });
            data = records.map(r => ({
                Employee_ID: r.Employee.employeeId,
                Name: `${r.Employee.firstName} ${r.Employee.lastName}`,
                Date: r.date,
                Status: r.status,
                Check_In: r.checkIn ? new Date(r.checkIn).toLocaleString() : 'N/A',
                Check_Out: r.checkOut ? new Date(r.checkOut).toLocaleString() : 'N/A',
                Working_Hours: r.workingHours || 0,
                Overtime: r.overtime || 0
            }));
        } 
        else if (type === 'payroll') {
            const records = await PayrollRecord.findAll({
                include: [{ model: Employee, attributes: ['firstName', 'lastName', 'employeeId'] }]
            });
            data = records.map(r => ({
                Employee_ID: r.Employee.employeeId,
                Name: `${r.Employee.firstName} ${r.Employee.lastName}`,
                Month: r.month,
                Year: r.year,
                Gross_Salary: r.grossSalary,
                Deductions: r.totalDeductions,
                Net_Salary: r.netSalary,
                Status: r.status
            }));
        }
        else if (type === 'performance') {
            const records = await Performance.findAll({
                include: [
                    { model: Employee, attributes: ['firstName', 'lastName', 'employeeId'] }
                ]
            });
            data = records.map(r => ({
                Employee_ID: r.Employee.employeeId,
                Name: `${r.Employee.firstName} ${r.Employee.lastName}`,
                Month: r.month,
                Year: r.year,
                Overall_Score: r.overallScore,
                Potential: r.potentialScore,
                Performance: r.performanceScore,
            }));
        }
        else if (type === 'employees') {
            const records = await Employee.findAll({
                include: [{ model: Department, attributes: ['name'] }]
            });
            data = records.map(r => ({
                Employee_ID: r.employeeId,
                Name: `${r.firstName} ${r.lastName}`,
                Department: r.Department ? r.Department.name : 'N/A',
                Designation: r.designation,
                Status: r.status,
                Joining_Date: r.joiningDate,
                Gender: r.gender,
                Contact: r.phone || 'N/A'
            }));
        } else {
            return res.status(400).json({ message: 'Invalid report type' });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate report', error: error.message });
    }
};

module.exports = { getReportData };
