const { Performance, Employee, Department, Objective, Feedback, User } = require('../models');
const { Op } = require('sequelize');

// DASHBOARD: Get My Performance Data
const getDashboardMy = async (req, res) => {
    try {
        const employeeId = req.user.employeeId;
        if (!employeeId) return res.status(400).json({ message: 'User is not an employee' });

        const performances = await Performance.findAll({ 
            where: { employeeId }, 
            order: [['year', 'DESC'], ['month', 'DESC']] 
        });
        const okrs = await Objective.findAll({ 
            where: { employeeId }, 
            order: [['deadline', 'ASC']] 
        });
        const feedbacks = await Feedback.findAll({ 
            where: { 
                [Op.or]: [
                    { targetEmployeeId: employeeId },
                    { authorId: req.user.id }
                ]
            }, 
            order: [['createdAt', 'DESC']],
            include: [
                { 
                    model: User, 
                    as: 'Author', 
                    attributes: ['id', 'email'],
                    include: [{ model: Employee, include: [{ model: Department }] }]
                },
                {
                    model: Employee,
                    as: 'TargetEmployee',
                    include: [{ model: Department }]
                }
            ]
        });

        res.json({ performances, okrs, feedbacks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DASHBOARD: Get All Performance Data (For HR/Admin)
const getDashboardAll = async (req, res) => {
    try {
        const performances = await Performance.findAll({
            include: [{ model: Employee, include: [Department] }]
        });
        res.json(performances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PERFORMANCE APPRAISAL
const addPerformance = async (req, res) => {
    try {
        const { employeeId, month, year, ratings, feedback, potentialScore, performanceScore } = req.body;

        const ratingValues = Object.values(ratings);
        const overallScore = ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length;

        const performance = await Performance.create({
            employeeId,
            reviewerId: req.user.id,
            month,
            year,
            ratings,
            overallScore,
            feedback,
            potentialScore: potentialScore || 2,
            performanceScore: performanceScore || 2
        });
        res.status(201).json(performance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const submitSelfAppraisal = async (req, res) => {
    try {
        const { selfAppraisalText, employeeAgreed } = req.body;
        const employeeId = req.user.employeeId;

        const date = new Date();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();

        let performance = await Performance.findOne({
            where: { employeeId, month, year }
        });

        if (!performance) {
            // Create new performance cycle if none exists for this month
            performance = await Performance.create({
                employeeId,
                month,
                year,
                ratings: { "Self Initiated": 5 },
                overallScore: 0,
                selfAppraisalText,
                employeeAgreed: employeeAgreed || false,
                potentialScore: 2, // defaults for 9-box
                performanceScore: 2
            });
        } else {
            performance.selfAppraisalText = selfAppraisalText;
            if (employeeAgreed !== undefined) performance.employeeAgreed = employeeAgreed;
            await performance.save();
        }

        res.json(performance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// OBJECTIVES (OKR)
const addObjective = async (req, res) => {
    try {
        const { employeeId, title, description, deadline } = req.body;
        const objective = await Objective.create({
            employeeId: employeeId || req.user.employeeId,
            title,
            description,
            deadline
        });
        res.status(201).json(objective);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateObjective = async (req, res) => {
    try {
        const { id } = req.params;
        const { progress, status } = req.body;

        const objective = await Objective.findByPk(id);
        if (!objective) return res.status(404).json({ message: 'Objective not found' });

        if (progress !== undefined) objective.progress = progress;
        if (status !== undefined) objective.status = status;

        await objective.save();
        res.json(objective);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// FEEDBACK TIMELINE
const addFeedback = async (req, res) => {
    try {
        const { targetEmployeeId, text, tags, type } = req.body;
        const feedback = await Feedback.create({
            targetEmployeeId,
            authorId: req.user.id,
            text,
            tags: tags || [],
            type: type || 'Peer'
        });
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardMy,
    getDashboardAll,
    addPerformance,
    submitSelfAppraisal,
    addObjective,
    updateObjective,
    addFeedback
};
