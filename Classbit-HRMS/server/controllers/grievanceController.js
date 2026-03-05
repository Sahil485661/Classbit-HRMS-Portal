const { Grievance, Employee, Department } = require('../models');

const submitGrievance = async (req, res) => {
    try {
        const { subject, description, isAnonymous } = req.body;
        const grievance = await Grievance.create({
            employeeId: req.user.employeeId,
            subject,
            description,
            isAnonymous: isAnonymous || false,
            status: 'Open'
        });
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
