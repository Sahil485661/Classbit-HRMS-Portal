const { sequelize } = require('./config/db');

async function run() {
    try {
        await sequelize.query('ALTER TABLE Employees ADD COLUMN deletedAt DATETIME DEFAULT NULL;');
        console.log('Added deletedAt to Employees');
    } catch (e) {
        console.log('Employees ignore:', e.message);
    }
    
    try {
        await sequelize.query('ALTER TABLE Users ADD COLUMN deletedAt DATETIME DEFAULT NULL;');
        console.log('Added deletedAt to Users');
    } catch (e) {
        console.log('Users ignore:', e.message);
    }
    process.exit(0);
}
run();
