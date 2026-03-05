const { Transaction } = require('../models');
const { Op } = require('sequelize');

const addTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.create(req.body);
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTransactions = async (req, res) => {
    try {
        const { type, startDate, endDate, category } = req.query;
        const where = {};
        if (type) where.type = type;
        if (category) where.category = category;
        if (startDate && endDate) {
            where.date = { [Op.between]: [startDate, endDate] };
        }

        const transactions = await Transaction.findAll({
            where,
            order: [['date', 'DESC']]
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfitLoss = async (req, res) => {
    try {
        const income = await Transaction.sum('amount', { where: { type: 'Income' } }) || 0;
        const expense = await Transaction.sum('amount', { where: { type: 'Expense' } }) || 0;
        res.json({ income, expense, profit: income - expense });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addTransaction,
    getTransactions,
    getProfitLoss
};
