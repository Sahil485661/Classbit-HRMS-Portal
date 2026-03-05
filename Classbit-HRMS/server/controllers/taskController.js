const { sequelize } = require('../config/db');
const { Task, TaskAssignment, Employee, User, Department, Role, Notification } = require('../models');
const { Op } = require('sequelize');

const createTask = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { title, description, deadline, priority, assignmentType, assigneeIds, departmentId } = req.body;

        // Verify creator existence
        const creator = await User.findByPk(req.user.id);
        if (!creator) {
            return res.status(401).json({ message: `Session user ID ${req.user.id} not found in database. Please log out and log back in.` });
        }

        const task = await Task.create({
            title,
            description,
            deadline,
            priority,
            createdBy: creator.id
        }, { transaction: t });

        let finalAssigneeIds = [];

        if (assignmentType === 'Single' || assignmentType === 'Single Employee' || assignmentType === 'Multiple' || assignmentType === 'Multiple Employees') {
            finalAssigneeIds = Array.isArray(assigneeIds) ? assigneeIds : (assigneeIds ? [assigneeIds] : []);
            if (finalAssigneeIds.length === 0) {
                await t.rollback();
                return res.status(400).json({ message: 'No employees selected for assignment' });
            }
        } else if (assignmentType === 'Department' || assignmentType === 'Entire Department') {
            if (!departmentId) {
                await t.rollback();
                return res.status(400).json({ message: 'Department must be specified for department assignment' });
            }
            const employees = await Employee.findAll({ where: { departmentId: parseInt(departmentId) } });
            finalAssigneeIds = employees.map(e => e.id);
        } else if (assignmentType === 'All' || assignmentType === 'All Employees') {
            const employees = await Employee.findAll({ where: { status: 'Active' } });
            finalAssigneeIds = employees.map(e => e.id);
        }

        if (finalAssigneeIds.length === 0) {
            await t.rollback();
            return res.status(400).json({ message: 'No active employees found for the selected assignment criteria' });
        }

        const assignments = finalAssigneeIds.map(empId => ({
            taskId: task.id,
            employeeId: empId
        }));

        await TaskAssignment.bulkCreate(assignments, { transaction: t });

        // Create Notifications for assignees
        const assigneeUsers = await Employee.findAll({
            where: { id: finalAssigneeIds },
            attributes: ['userId']
        });

        const notifications = assigneeUsers.map(emp => ({
            userId: emp.userId,
            title: 'New Task Assigned',
            message: `New task: "${title || 'Untitled Task'}" has been assigned to you.`,
            type: 'Task',
            relatedId: task.id
        }));

        await Notification.bulkCreate(notifications, { transaction: t });

        await t.commit();
        res.status(201).json(task);
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: error.message });
    }
};

const getMyTasks = async (req, res) => {
    try {
        const { role, employeeId, id: userId } = req.user;

        let tasks;
        const commonInclude = [
            { model: User, as: 'Creator', include: [{ model: Employee, attributes: ['firstName', 'lastName'] }] }
        ];

        if (role === 'Super Admin' || role === 'HR') {
            tasks = await Task.findAll({
                include: [...commonInclude, { model: TaskAssignment, include: [Employee] }],
                order: [['createdAt', 'DESC']]
            });
        } else if (role === 'Manager') {
            tasks = await Task.findAll({
                include: [
                    ...commonInclude,
                    {
                        model: TaskAssignment,
                        include: [Employee]
                    }
                ],
                where: {
                    [Op.or]: [
                        { '$TaskAssignments.employeeId$': employeeId },
                        { createdBy: userId }
                    ]
                },
                order: [['createdAt', 'DESC']]
            });
        } else {
            // Regular Employee
            tasks = await Task.findAll({
                include: [
                    ...commonInclude,
                    {
                        model: TaskAssignment,
                        where: { employeeId },
                        required: true,
                        include: [Employee]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
        }

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const assignment = await TaskAssignment.findOne({
            where: { taskId: task.id, employeeId: req.user.employeeId }
        });

        if (!assignment && req.user.role !== 'Super Admin' && req.user.role !== 'HR' && task.createdBy !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        task.status = status;
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTask,
    getMyTasks,
    updateTaskStatus
};
