const { Notice } = require('../models');
const { Op } = require('sequelize');

const createNotice = async (req, res) => {
    try {
        const notice = await Notice.create(req.body);
        res.status(201).json(notice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getActiveNotices = async (req, res) => {
    try {
        const notices = await Notice.findAll({
            where: {
                isActive: true,
                [Op.or]: [
                    { expiryDate: null },
                    { expiryDate: { [Op.gte]: new Date() } }
                ]
            },
            order: [['createdAt', 'DESC']]
        });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteNotice = async (req, res) => {
    try {
        await Notice.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Notice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createNotice,
    getActiveNotices,
    deleteNotice
};
