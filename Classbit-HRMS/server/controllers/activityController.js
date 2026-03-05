const { ActivityLog, User, Employee } = require('../models');

const getLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.findAll({
            include: [{ model: User, attributes: ['email'], include: [Employee] }],
            order: [['createdAt', 'DESC']],
            limit: 100
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createLog = async (userId, action, module, details = null, ipAddress = null) => {
    try {
        await ActivityLog.create({ userId, action, module, details, ipAddress });
    } catch (error) {
        console.error('Error creating activity log:', error);
    }
};

module.exports = { getLogs, createLog };
