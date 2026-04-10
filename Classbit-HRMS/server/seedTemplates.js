const { EmailTemplate } = require('./models');

async function seed() {
    const templates = [
        {
            name: 'LEAVE_APPROVAL',
            subject: 'Leave Request Approved',
            htmlBody: '<p>Hello {employee_name},</p><p>Your leave request from {start_date} to {end_date} has been approved.</p>'
        },
        {
            name: 'LEAVE_REJECTION',
            subject: 'Leave Request Rejected',
            htmlBody: '<p>Hello {employee_name},</p><p>Your leave request from {start_date} to {end_date} has been rejected. Reason: {reason}</p>'
        },
        {
            name: 'REIMBURSEMENT_APPROVAL',
            subject: 'Reimbursement Claim Approved',
            htmlBody: '<p>Hello {employee_name},</p><p>Your reimbursement claim of {amount} has been approved.</p>'
        },
        {
            name: 'REIMBURSEMENT_REJECTION',
            subject: 'Reimbursement Claim Rejected',
            htmlBody: '<p>Hello {employee_name},</p><p>Your reimbursement claim of {amount} has been rejected. Reason: {reason}</p>'
        }
    ];

    for (const t of templates) {
        const ext = await EmailTemplate.findOne({ where: { name: t.name } });
        if (!ext) {
            await EmailTemplate.create(t);
            console.log(`Created template: ${t.name}`);
        } else {
            console.log(`Template exists: ${t.name}`);
        }
    }
}
seed();
