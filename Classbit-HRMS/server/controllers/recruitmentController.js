const { Job, Candidate } = require('../models');

const createJob = async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll({ order: [['createdAt', 'DESC']] });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const applyForJob = async (req, res) => {
    try {
        const { jobId, firstName, lastName, email, phone } = req.body;
        const resume = req.file ? req.file.path : null;
        const candidate = await Candidate.create({
            jobId,
            firstName,
            lastName,
            email,
            phone,
            resume
        });
        res.status(201).json(candidate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCandidates = async (req, res) => {
    try {
        const { jobId } = req.query;
        const where = jobId ? { jobId } : {};
        const candidates = await Candidate.findAll({
            where,
            include: [Job],
            order: [['createdAt', 'DESC']]
        });
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCandidateStatus = async (req, res) => {
    try {
        const candidate = await Candidate.findByPk(req.params.id);
        if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

        await candidate.update(req.body);
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createJob,
    getJobs,
    applyForJob,
    getCandidates,
    updateCandidateStatus
};
