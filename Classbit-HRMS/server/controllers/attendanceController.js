const { Attendance, Employee, Department } = require('../models');
const { Op } = require('sequelize');

const clockIn = async (req, res) => {
    try {
        const { employeeId } = req.user;
        if (!employeeId) return res.status(400).json({ message: 'User is not an employee' });

        const today = new Date().toLocaleDateString('en-CA');

        // Check if already clocked in today
        const existing = await Attendance.findOne({
            where: { employeeId, date: today }
        });

        if (existing) {
            return res.status(400).json({ message: 'Already clocked in today' });
        }

        const attendance = await Attendance.create({
            employeeId,
            date: today,
            checkIn: new Date(),
            status: 'Present'
        });

        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const clockOut = async (req, res) => {
    try {
        const { employeeId } = req.user;
        const today = new Date().toLocaleDateString('en-CA');

        const attendance = await Attendance.findOne({
            where: { employeeId, date: today }
        });

        if (!attendance) {
            return res.status(404).json({ message: 'No clock-in record found for today' });
        }

        if (attendance.checkOut) {
            return res.status(400).json({ message: 'Already clocked out today' });
        }

        attendance.checkOut = new Date();

        // Calculate working hours
        const checkIn = new Date(attendance.checkIn);
        const checkOut = new Date(attendance.checkOut);
        const diffMs = checkOut - checkIn;
        const diffHrs = diffMs / (1000 * 60 * 60);

        attendance.workingHours = parseFloat(diffHrs.toFixed(2));

        // Simple Overtime calculation (> 8 hours)
        if (diffHrs > 8) {
            attendance.overtime = parseFloat((diffHrs - 8).toFixed(2));
        }

        await attendance.save();

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyAttendance = async (req, res) => {
    try {
        const { employeeId } = req.user;
        const attendance = await Attendance.findAll({
            where: { employeeId },
            order: [['date', 'DESC']]
        });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllAttendance = async (req, res) => {
    try {
        const { date, departmentId } = req.query;
        const where = {};
        if (date) where.date = date;

        const include = [{ model: Employee, include: [Department] }];
        if (departmentId) {
            include[0].where = { departmentId };
        }

        const attendance = await Attendance.findAll({
            where,
            include
        });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    clockIn,
    clockOut,
    getMyAttendance,
    getAllAttendance
};
