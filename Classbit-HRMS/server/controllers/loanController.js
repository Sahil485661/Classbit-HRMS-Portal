const { Loan, Employee, Department } = require('../models');

const applyLoan = async (req, res) => {
    try {
        const { amount, reason, repaymentMonths } = req.body;
        const monthlyInstallment = amount / repaymentMonths;

        const loan = await Loan.create({
            employeeId: req.user.employeeId,
            amount,
            reason,
            repaymentMonths,
            monthlyInstallment,
            remainingAmount: amount,
            status: 'Pending'
        });
        res.status(201).json(loan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyLoans = async (req, res) => {
    try {
        const loans = await Loan.findAll({
            where: { employeeId: req.user.employeeId },
            order: [['createdAt', 'DESC']]
        });
        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.findAll({
            include: [{ model: Employee, include: [Department] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateLoanStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const loan = await Loan.findByPk(req.params.id);
        if (!loan) return res.status(404).json({ message: 'Loan request not found' });

        loan.status = status;
        await loan.save();

        res.json(loan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyLoan,
    getMyLoans,
    getAllLoans,
    updateLoanStatus
};
