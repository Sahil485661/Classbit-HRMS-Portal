const { sequelize } = require('./config/db');
const { EmailTemplate, EmailLog } = require('./models');

const defaultTemplates = [
    {
        name: 'PASSWORD_RESET',
        subject: 'Classbit HRMS - Password Reset OTP',
        description: 'Sent when an employee requests a password reset or HR triggers it.',
        htmlBody: `
<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #3b82f6; text-align: center;">{company_name} Password Reset</h2>
    <p style="color: #555;">You requested a password reset. Please use the following OTP to reset your password. This OTP is valid for 10 minutes.</p>
    <div style="background-color: #f3f4f6; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <h1 style="color: #1f2937; letter-spacing: 5px; margin: 0; font-size: 32px;">{otp}</h1>
    </div>
    <p style="color: #555;">If you did not request this password reset, please ignore this email or contact your systematic administrator.</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
    <p style="text-align: center; color: #999; font-size: 12px;">{company_name} Portal: <a href="{portal_url}">{portal_url}</a></p>
</div>`
    },
    {
        name: 'LOAN_APPROVAL',
        subject: 'Loan Request Approved - {company_name}',
        description: 'Sent when a loan request is approved.',
        htmlBody: `
<div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Loan Approved</h2>
    <p>Dear {employee_name},</p>
    <p>Your loan request has been <strong>approved</strong>.</p>
    <p>Details:</p>
    <ul>
        <li>Amount: {amount}</li>
        <li>Installments: {installments} months</li>
    </ul>
    <p>Please contact {hr_contact} if you have any questions.</p>
</div>`
    },
    {
        name: 'LOAN_REJECTION',
        subject: 'Loan Request Update - {company_name}',
        description: 'Sent when a loan request is rejected.',
        htmlBody: `
<div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Loan Request Rejected</h2>
    <p>Dear {employee_name},</p>
    <p>We regret to inform you that your loan request has been <strong>rejected</strong>.</p>
    <p>Please contact {hr_contact} for more details.</p>
</div>`
    },
    {
        name: 'LEAVE_APPROVAL',
        subject: 'Leave Request Approved - {company_name}',
        description: 'Sent when a leave request is approved.',
        htmlBody: `
<div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Leave Approved</h2>
    <p>Dear {employee_name},</p>
    <p>Your leave request from <strong>{start_date}</strong> to <strong>{end_date}</strong> has been approved.</p>
    <p>Have a great time!</p>
</div>`
    },
    {
        name: 'LEAVE_REJECTION',
        subject: 'Leave Request Update - {company_name}',
        description: 'Sent when a leave request is rejected.',
        htmlBody: `
<div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Leave Request Rejected</h2>
    <p>Dear {employee_name},</p>
    <p>Your leave request from {start_date} to {end_date} has been <strong>rejected</strong>.</p>
    <p>Reason: {reason}</p>
    <p>Please contact your reporting manager or {hr_contact} for more details.</p>
</div>`
    },
    {
        name: 'REIMBURSEMENT_APPROVAL',
        subject: 'Reimbursement Claim Approved - {company_name}',
        description: 'Sent when a reimbursement is approved.',
        htmlBody: `
<div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Reimbursement Approved</h2>
    <p>Dear {employee_name},</p>
    <p>Your reimbursement claim of <strong>{amount}</strong> for <em>{category}</em> has been approved and will be processed in the next payment cycle.</p>
</div>`
    },
    {
        name: 'REIMBURSEMENT_REJECTION',
        subject: 'Reimbursement Claim Update - {company_name}',
        description: 'Sent when a reimbursement is rejected.',
        htmlBody: `
<div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Reimbursement Rejected</h2>
    <p>Dear {employee_name},</p>
    <p>Your reimbursement claim of {amount} for {category} has been <strong>rejected</strong>.</p>
    <p>Reason: {reason}</p>
</div>`
    }
];

async function seedTemplates() {
    try {
        await sequelize.sync({ alter: true });
        console.log('Tables synced.');

        for (const tmpl of defaultTemplates) {
            const existing = await EmailTemplate.findOne({ where: { name: tmpl.name } });
            if (!existing) {
                await EmailTemplate.create(tmpl);
                console.log(`Created template: ${tmpl.name}`);
            }
        }
        console.log('Template seeding complete.');
    } catch (err) {
        console.error('Error seeding templates:', err);
    } finally {
        process.exit();
    }
}

seedTemplates();
