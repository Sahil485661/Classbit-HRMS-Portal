const { EmailTemplate } = require('./models');

async function seed() {
    const template = await EmailTemplate.findOne({ where: { name: 'MEETING_INVITE' } });
    if (!template) {
        await EmailTemplate.create({
            name: 'MEETING_INVITE',
            subject: 'Meeting Invitation: {meeting_title}',
            htmlBody: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaebf0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
    <div style="background-color: #3b82f6; color: white; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.5px;">Meeting Invitation</h1>
    </div>
    <div style="padding: 32px 24px;">
        <p style="font-size: 16px; color: #334155; margin-bottom: 24px;">Hello <strong>{employee_name}</strong>,</p>
        <p style="font-size: 16px; color: #475569; line-height: 1.5; margin-bottom: 24px;">You have been invited to a scheduled meeting. Here are the details:</p>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 12px 0; font-size: 15px;"><strong>Topic:</strong> <span style="color: #3b82f6;">{meeting_title}</span></p>
            <p style="margin: 0 0 12px 0; font-size: 15px;"><strong>Date & Time:</strong> {meeting_time}</p>
            <p style="margin: 0; font-size: 15px;"><strong>Agenda:</strong></p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #64748b; line-height: 1.6;">{agenda}</p>
        </div>

        <div style="text-align: center; margin-top: 32px;">
            <a href="{meeting_link}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-weight: 600; padding: 14px 32px; border-radius: 8px; font-size: 16px; transition: background-color 0.2s;">
                Join Meeting
            </a>
        </div>
        
        <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 24px;">
            Please try to join 5 minutes early. If you cannot attend, please decline the meeting on the HRMS portal.
        </p>
    </div>
</div>
            `
        });
        console.log("MEETING_INVITE template created successfully.");
    } else {
        console.log("MEETING_INVITE template already exists.");
    }
}
seed();
