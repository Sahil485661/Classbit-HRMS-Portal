const { sendTemplatedEmail } = require('../utils/emailService');
const { Loan, LeaveRequest, ReimbursementClaim, Employee, User } = require('../models');

exports.notifyLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const loan = await Loan.findByPk(id, {
            include: [{ model: Employee, include: [User] }]
        });

        if (!loan || !loan.Employee || !loan.Employee.User) {
            return res.status(404).json({ message: 'Loan or Employee (with User mapping) not found' });
        }

        const templateName = loan.status === 'Approved' ? 'LOAN_APPROVAL' : 'LOAN_REJECTION';
        const variables = {
            company_name: 'Classbit HRMS',
            portal_url: 'http://localhost:5173',
            employee_name: `${loan.Employee.firstName} ${loan.Employee.lastName}`,
            amount: loan.amount,
            installments: loan.installments,
            hr_contact: 'hr@company.com'
        };

        const success = await sendTemplatedEmail(templateName, loan.Employee.User.email, variables, req.user.role);
        
        if (success) {
            res.json({ message: 'Employee notified successfully' });
        } else {
            res.status(500).json({ message: 'Failed to send email. Check logs for details.' });
        }
    } catch (error) {
        console.error('Error notifying loan status:', error);
        res.status(500).json({ message: 'Server error notifying status' });
    }
};

exports.notifyLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const leave = await LeaveRequest.findByPk(id, {
            include: [{ model: Employee, include: [User] }]
        });

        if (!leave || !leave.Employee || !leave.Employee.User) {
            return res.status(404).json({ message: 'Leave or linked abstract not found' });
        }

        const templateName = leave.status === 'Approved' ? 'LEAVE_APPROVAL' : 'LEAVE_REJECTION';
        const variables = {
            company_name: 'Classbit HRMS',
            portal_url: 'http://localhost:5173',
            employee_name: `${leave.Employee.firstName} ${leave.Employee.lastName}`,
            start_date: leave.startDate,
            end_date: leave.endDate,
            reason: leave.reason || 'N/A',
            hr_contact: 'hr@company.com'
        };

        const success = await sendTemplatedEmail(templateName, leave.Employee.User.email, variables, req.user.role);
        
        if (success) {
            res.json({ message: 'Employee notified successfully' });
        } else {
            res.status(500).json({ message: 'Failed to send email' });
        }
    } catch (error) {
        console.error('Error notifying leave status:', error);
        res.status(500).json({ message: 'Server error notifying status' });
    }
};

exports.notifyReimbursement = async (req, res) => {
    try {
        const { id } = req.params;
        const claim = await ReimbursementClaim.findByPk(id, {
            include: [{ model: Employee, include: [User] }]
        });

        if (!claim || !claim.Employee || !claim.Employee.User) {
            return res.status(404).json({ message: 'Reimbursement or employee missing' });
        }

        const templateName = claim.status === 'Approved' ? 'REIMBURSEMENT_APPROVAL' : 'REIMBURSEMENT_REJECTION';
        const variables = {
            company_name: 'Classbit HRMS',
            portal_url: 'http://localhost:5173',
            employee_name: `${claim.Employee.firstName} ${claim.Employee.lastName}`,
            amount: claim.amount,
            category: claim.categoryId, // Ideal to get category name but passing ID for simple mapping
            reason: claim.rejectionReason || 'Reviewed locally',
            hr_contact: 'hr@company.com'
        };

        const success = await sendTemplatedEmail(templateName, claim.Employee.User.email, variables, req.user.role);
        
        if (success) {
            res.json({ message: 'Employee notified successfully' });
        } else {
            res.status(500).json({ message: 'Failed to send email' });
        }
    } catch (error) {
        console.error('Error notifying reimbursement status:', error);
        res.status(500).json({ message: 'Server error notifying status' });
    }
};
