const { Performance, Employee, Department } = require('../models');

const addPerformance = async (req, res) => {
    try {
        const { employeeId, month, year, ratings, feedback } = req.body;

        // Calculate overall score
        const ratingValues = Object.values(ratings);
        const overallScore = ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length;

        const performance = await Performance.create({
            employeeId,
            reviewerId: req.user.id,
            month,
            year,
            ratings,
            overallScore,
            feedback
        });
        res.status(201).json(performance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEmployeePerformance = async (req, res) => {
    try {
        const performance = await Performance.findAll({
            where: { employeeId: req.params.employeeId },
            order: [['year', 'DESC'], ['month', 'DESC']]
        });
        res.json(performance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyPerformance = async (req, res) => {
    try {
        const performance = await Performance.findAll({
            where: { employeeId: req.user.employeeId },
            order: [['year', 'DESC'], ['month', 'DESC']]
        });
        res.json(performance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addPerformance,
    getEmployeePerformance,
    getMyPerformance
};
