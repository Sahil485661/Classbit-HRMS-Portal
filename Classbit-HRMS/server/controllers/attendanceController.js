const { Attendance, Employee, Department, AttendanceActivity } = require('../models');
const { Op } = require('sequelize');

const clockIn = async (req, res) => {
    try {
        const { employeeId } = req.user;
        if (!employeeId) return res.status(400).json({ message: 'User is not an employee' });

        const today = new Date().toLocaleDateString('en-CA');

        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();

        // Check if office time is over (After 6:00 PM)
        if (hour >= 18) {
            return res.status(400).json({ message: 'Clock in is not allowed after 6:00 PM' });
        }

        // Check if already clocked in today
        const existing = await Attendance.findOne({
            where: { employeeId, date: today }
        });

        if (existing) {
            return res.status(400).json({ message: 'Already clocked in today' });
        }
        
        // Status logic: Late if after 9:15 AM
        let status = 'Present';
        if (hour > 9 || (hour === 9 && minute > 15)) {
            status = 'Late';
        }

        const attendance = await Attendance.create({
            employeeId,
            date: today,
            checkIn: now,
            status: status,
            currentStatus: 'Working'
        });

        // Start initial "Working" activity
        await AttendanceActivity.create({
            attendanceId: attendance.id,
            type: 'Working',
            startTime: now
        });

        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { employeeId } = req.user;
        const { type } = req.body; 
        const today = new Date().toLocaleDateString('en-CA');

        // Look for the most recent check-in that hasn't been checked out
        const attendance = await Attendance.findOne({
            where: { employeeId, checkOut: null },
            order: [['date', 'DESC']]
        });

        if (!attendance) {
            console.log('Attendance record not found for employee:', employeeId, 'on date:', today);
            return res.status(404).json({ 
                message: 'No active clock-in record found. Please clock in first.',
                debug: { employeeId, today }
            });
        }

        console.log('Found attendance record ID:', attendance.id);
        if (attendance.checkOut) {
            return res.status(400).json({ message: 'Already clocked out today' });
        }

        const now = new Date();

        // 1. End current activity
        const currentActivity = await AttendanceActivity.findOne({
            where: { attendanceId: attendance.id, endTime: null }
        });

        if (currentActivity) {
            console.log('Ending current activity:', currentActivity.type);
            currentActivity.endTime = now;
            const diffMs = currentActivity.endTime - currentActivity.startTime;
            currentActivity.duration = Math.round(diffMs / (1000 * 60)); 
            await currentActivity.save();
        }

        // 2. Start new activity
        console.log('Starting new activity:', type);
        await AttendanceActivity.create({
            attendanceId: attendance.id,
            type: type,
            startTime: now
        });

        // 3. Update current status in Attendance
        attendance.currentStatus = type;
        await attendance.save();

        console.log('Status updated successfully to:', type);
        res.json(attendance);
    } catch (error) {
        console.error('Update status ERROR:', error);
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

        // End current activity
        const currentActivity = await AttendanceActivity.findOne({
            where: { attendanceId: attendance.id, endTime: null }
        });
        if (currentActivity) {
            currentActivity.endTime = attendance.checkOut;
            const diffMs = currentActivity.endTime - currentActivity.startTime;
            currentActivity.duration = Math.round(diffMs / (1000 * 60));
            await currentActivity.save();
        }

        attendance.currentStatus = 'Closed';

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
            include: [AttendanceActivity],
            order: [['date', 'DESC'], [AttendanceActivity, 'startTime', 'ASC']]
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

        const include = [
            { model: Employee, include: [Department] },
            { model: AttendanceActivity }
        ];
        if (departmentId) {
            include[0].where = { departmentId };
        }

        const attendance = await Attendance.findAll({
            where,
            include,
            order: [['date', 'DESC'], [AttendanceActivity, 'startTime', 'ASC']]
        });

        // Inject Virtual Absent Records for requested date or today
        const targetDate = date || new Date().toLocaleDateString('en-CA');
        
        // Find all active employees (filtered by department if provided)
        const empWhere = { status: 'Active' };
        if (departmentId) empWhere.departmentId = departmentId;
        const activeEmployees = await Employee.findAll({
            where: empWhere,
            include: [Department]
        });

        // Extract IDs of employees who ALREADY have a record on targetDate
        const presentIds = new Set(
            attendance.filter(a => a.date === targetDate).map(a => a.employeeId)
        );

        // Generate virtual missing records
        const absentRecords = [];
        activeEmployees.forEach(emp => {
            if (!presentIds.has(emp.id)) {
                absentRecords.push({
                    id: `virtual-absent-${emp.id}-${targetDate}`,
                    employeeId: emp.id,
                    date: targetDate,
                    checkIn: null,
                    checkOut: null,
                    workingHours: 0,
                    overtime: 0,
                    status: 'Absent',
                    currentStatus: 'Absent',
                    Employee: emp,
                    AttendanceActivities: []
                });
            }
        });

        // Combine and re-sort descending by date
        const combined = [...attendance, ...absentRecords].sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(combined);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    clockIn,
    clockOut,
    updateStatus,
    getMyAttendance,
    getAllAttendance
};
