const { Attendance } = require('./models');

async function test() {
    try {
        const records = await Attendance.findAll({ order: [['date', 'DESC']], limit: 5 });
        console.log("Most recent Attendance Dates in DB:");
        records.forEach(r => console.log(`ID: ${r.id}, Date: ${r.date}, Status: ${r.status}, type: ${typeof r.date}`));
        
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
test();
