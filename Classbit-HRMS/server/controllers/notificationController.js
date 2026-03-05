const { Notification } = require('../models');

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 50
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        await Notification.update({ isRead: true }, {
            where: { id: req.params.id, userId: req.user.id }
        });
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        await Notification.update({ isRead: true }, {
            where: { userId: req.user.id, isRead: false }
        });
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead
};
