const { Grievance, Employee, Department, Notification, User, Role } = require('../models');

const submitGrievance = async (req, res) => {
    try {
        const { subject, description, isAnonymous, category } = req.body;
        const grievance = await Grievance.create({
            employeeId: req.user.employeeId,
            subject,
            description,
            category: category || 'General',
            isAnonymous: isAnonymous || false,
            status: 'Open'
        });

        // Notify Admins and HR
        const adminRoles = await Role.findAll({ where: { name: ['Super Admin', 'HR'] } });
        const adminUsers = await User.findAll({ where: { roleId: adminRoles.map(r => r.id) } });

        const employee = await Employee.findByPk(req.user.employeeId);
        const empName = isAnonymous ? 'Anonymous Employee' : (employee ? `${employee.firstName} ${employee.lastName}` : 'An employee');

        const notifications = adminUsers.map(user => ({
            userId: user.id,
            title: 'New Grievance Raised',
            message: `${empName} has raised a new concern: "${subject}"`,
            type: 'General',
            relatedId: grievance.id
        }));

        await Notification.bulkCreate(notifications);

        res.status(201).json(grievance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyGrievances = async (req, res) => {
    try {
        const grievances = await Grievance.findAll({
            where: { employeeId: req.user.employeeId },
            order: [['createdAt', 'DESC']]
        });
        res.json(grievances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllGrievances = async (req, res) => {
    try {
        const grievances = await Grievance.findAll({
            include: [{ model: Employee, include: [Department] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(grievances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resolveGrievance = async (req, res) => {
    try {
        const { status, response } = req.body;
        const grievance = await Grievance.findByPk(req.params.id);
        if (!grievance) return res.status(404).json({ message: 'Grievance not found' });

        grievance.status = status;
        grievance.response = response;
        grievance.resolvedBy = req.user.id;
        await grievance.save();

        // Notify Employee
        const emp = await Employee.findByPk(grievance.employeeId);
        if (emp) {
            await Notification.create({
                userId: emp.userId,
                title: 'Grievance Update',
                message: `Your grievance regarding "${grievance.subject}" has been marked as ${status}.`,
                type: 'General',
                relatedId: grievance.id
            });
        }

        res.json(grievance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitGrievance,
    getMyGrievances,
    getAllGrievances,
    resolveGrievance
};
