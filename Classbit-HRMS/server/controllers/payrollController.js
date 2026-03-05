const { PayrollRecord, SalaryComponent, Employee, Attendance, Transaction, sequelize } = require('../models');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
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
            { where: { month, year, status: 'Generated' } }
        );
        res.json({ message: 'Payroll cycle locked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const disbursePayroll = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { month, year } = req.body;

        // Find all records for this period that are not yet paid
        const records = await PayrollRecord.findAll({
            where: { month, year, status: { [Op.ne]: 'Paid' } },
            include: [Employee]
        });

        if (records.length === 0) {
            return res.status(400).json({ message: 'No records found to disburse for this period.' });
        }

        let totalDisbursed = 0;

        for (const rec of records) {
            rec.status = 'Paid';
            await rec.save({ transaction: t });
            totalDisbursed += parseFloat(rec.netSalary);

            // record expense
            await Transaction.create({
                type: 'Expense',
                category: 'Payroll',
                amount: rec.netSalary,
                date: new Date(),
                description: `Salary disbursement for ${rec.Employee.firstName} ${rec.Employee.lastName} (${month}/${year})`,
                paymentMethod: 'Bank Transfer'
            }, { transaction: t });
        }

        await t.commit();
        res.json({ message: `Successfully disbursed ${records.length} salaries.`, total: totalDisbursed });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: error.message });
    }
};

const downloadPayslip = async (req, res) => {
    try {
        const { id } = req.params;
        const payroll = await PayrollRecord.findByPk(id, {
            include: [{ model: Employee, include: ['Department'] }]
        });

        if (!payroll) return res.status(404).json({ message: 'Payroll record not found' });

        const doc = new PDFDocument({ margin: 50 });
        const filename = `Payslip_${payroll.Employee.employeeId}_${payroll.month}_${payroll.year}.pdf`;

        res.setHeader('Content-disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        // Header
        doc.fontSize(20).text('CLASSBIT HRMS - PAYSLIP', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).text(`Statement for: ${new Date(0, payroll.month - 1).toLocaleString('default', { month: 'long' })} ${payroll.year}`, { align: 'center' });
        doc.moveDown(2);

        // Employee Info
        doc.fontSize(12).text('EMPLOYEE INFORMATION', { underline: true });
        doc.moveDown();
        doc.fontSize(10).text(`Name: ${payroll.Employee.firstName} ${payroll.Employee.lastName}`);
        doc.text(`Employee ID: ${payroll.Employee.employeeId}`);
        doc.text(`Department: ${payroll.Employee.Department?.name || 'N/A'}`);
        doc.text(`Designation: ${payroll.Employee.designation}`);
        doc.moveDown(2);

        // Salary Breakdown
        doc.fontSize(12).text('SALARY BREAKDOWN', { underline: true });
        doc.moveDown();
        doc.fontSize(10);
        doc.text(`Gross Salary: $${payroll.grossSalary}`);
        doc.text(`Total Deductions: -$${payroll.totalDeductions}`);
        doc.moveDown();
        doc.fontSize(14).font('Helvetica-Bold').text(`NET PAYOUT: $${payroll.netSalary}`, { color: '#3b82f6' });
        doc.moveDown(3);

        // Footer
        doc.font('Helvetica-Oblique').fontSize(8).text('This is a computer generated document and does not require a physical signature.', { align: 'center' });

        doc.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    generatePayroll,
    getMyPayslips,
    getAllPayslips,
    lockPayroll,
    disbursePayroll,
    downloadPayslip
};
