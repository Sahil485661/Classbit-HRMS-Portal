const { sequelize, Feedback, User, Employee, Department } = require('./models');

async function test() {
    try {
        const feedbacks = await Feedback.findAll({
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
        console.log(JSON.stringify(feedbacks, null, 2));
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
test();
