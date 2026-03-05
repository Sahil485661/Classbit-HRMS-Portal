const { Message, User, Employee, Department } = require('../models');
const { Op } = require('sequelize');

const sendMessage = async (req, res) => {
    try {
        const { recipientId, departmentId, subject = 'Chat Message', content } = req.body;
        const attachment = req.file ? req.file.path : null;

        if (departmentId) {
            // Broadcast to department
            const employees = await Employee.findAll({ where: { departmentId } });
            const messages = employees.map(emp => ({
                senderId: req.user.id,
                recipientId: emp.userId,
                departmentId,
                subject,
                content,
                attachment
            }));
            await Message.bulkCreate(messages);
            return res.status(201).json({ message: 'Broadcast sent successfully' });
        }

        const targetEmployee = await Employee.findByPk(recipientId);
        if (!targetEmployee) return res.status(404).json({ message: 'Recipient not found' });

        const message = await Message.create({
            senderId: req.user.id,
            recipientId: targetEmployee.userId,
            subject,
            content,
            attachment
        });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getInbox = async (req, res) => {
    try {
        const messages = await Message.findAll({
            where: { recipientId: req.user.id },
            include: [{ model: User, as: 'Sender', attributes: ['email'], include: [Employee] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOutbox = async (req, res) => {
    try {
        const messages = await Message.findAll({
            where: { senderId: req.user.id },
            include: [{ model: User, as: 'Recipient', attributes: ['email'], include: [Employee] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        await Message.update({ isRead: true }, { where: { id: req.params.id, recipientId: req.user.id } });
        res.json({ message: 'Message marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getConversation = async (req, res) => {
    try {
        const { recipientId } = req.params; // This is the employee ID from frontend
        const targetEmployee = await Employee.findByPk(recipientId);
        if (!targetEmployee) return res.status(404).json({ message: 'Recipient not found' });

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: req.user.id, recipientId: targetEmployee.userId },
                    { senderId: targetEmployee.userId, recipientId: req.user.id }
                ]
            },
            include: [
                { model: User, as: 'Sender', attributes: ['id', 'email'] }
            ],
            order: [['createdAt', 'ASC']]
        });

        // Mark received messages as read
        await Message.update(
            { isRead: true },
            {
                where: {
                    recipientId: req.user.id,
                    senderId: targetEmployee.userId,
                    isRead: false
                }
            }
        );

        res.json(messages);
    } catch (error) {
        console.error('getConversation Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendMessage,
    getInbox,
    getOutbox,
    getConversation,
    markAsRead
};
