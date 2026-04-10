

async function test() {
    try {
        // Need to hit the DB directly or use a dummy token
        const { Meeting, sequelize } = require('./models');
        await sequelize.authenticate();
        
        console.log("Creating meeting manually...");
        const m = await Meeting.create({
            title: 'Test',
            dateTime: new Date(),
            agenda: 'Test',
            meetingLink: 'test',
            organizerId: '123e4567-e89b-12d3-a456-426614174000', // random uuid
            targetAudience: { type: 'all', data: [] }
            // employeeReactions default []
        });
        console.log("Success:", m.toJSON());
    } catch(err) {
        console.error("DB Error:", err);
    }
}
test();
