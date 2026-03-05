const { LeaveRequest, Employee, Department, Notification, User, Role } = require('../models');

const applyLeave = async (req, res) => {
    try {
        const { leaveTypeId, startDate, endDate, reason } = req.body;
        const leaveRequest = await LeaveRequest.create({
            employeeId: req.user.employeeId,
            leaveTypeId,
            startDate,
            endDate,
            reason,
            status: 'Pending'
        });

        // Notify Admins and HR
        const adminRoles = await Role.findAll({ where: { name: ['Super Admin', 'HR'] } });
        const adminUsers = await User.findAll({ where: { roleId: adminRoles.map(r => r.id) } });

        const employee = await Employee.findByPk(req.user.employeeId);
        const empName = employee ? `${employee.firstName} ${employee.lastName}` : 'A staff member';

        const notifications = adminUsers.map(user => ({
            userId: user.id,
            title: 'New Leave Request',
            message: `${empName} has applied for leave.`,
            type: 'Leave',
            relatedId: leaveRequest.id
        }));

        await Notification.bulkCreate(notifications);

        res.status(201).json(leaveRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyLeaves = async (req, res) => {
    try {
        const leaves = await LeaveRequest.findAll({
            where: { employeeId: req.user.employeeId },
            order: [['createdAt', 'DESC']]
        });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllLeaves = async (req, res) => {
    try {
        const leaves = await LeaveRequest.findAll({
            include: [{ model: Employee, include: [Department] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateLeaveStatus = async (req, res) => {
    try {
        const { status, comment } = req.body;
        const leave = await LeaveRequest.findByPk(req.params.id);
        if (!leave) return res.status(404).json({ message: 'Leave request not found' });

        leave.status = status;
        leave.comment = comment;
        leave.approvedBy = req.user.id;
        leave.approvalDate = new Date();
        await leave.save();

        // Notify Employee
        const emp = await Employee.findByPk(leave.employeeId);
        if (emp) {
            await Notification.create({
                userId: emp.userId,
                title: 'Leave Request Update',
                message: `Your leave request from ${leave.startDate} has been ${status}.`,
                type: 'Leave',
                relatedId: leave.id
            });
        }

        res.json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    updateLeaveStatus
};
