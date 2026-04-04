const { ActivityLog, User, Employee, Role } = require('../models');

const getLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.findAll({
            include: [{ model: User, attributes: ['email'], include: [Employee, Role] }],
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

const purgeLogs = async (req, res) => {
    try {
        await ActivityLog.destroy({ where: {} });
        await createLog(req.user.id, 'PURGE_LOGS', 'System', 'Master Purge: All activity logs were wiped.');
        res.json({ message: 'All logs have been successfully purged from the database.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getLogs, createLog, purgeLogs };
