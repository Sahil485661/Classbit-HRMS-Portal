const { sequelize } = require('./config/db');

async function run() {
    try {
        await sequelize.query('ALTER TABLE Employees ADD COLUMN trainingPeriodMonths INT DEFAULT 0;');
        console.log('Added trainingPeriodMonths to Employees');
    } catch (e) {
        console.log('trainingPeriodMonths ignore:', e.message);
    }
    
    try {
        await sequelize.query('ALTER TABLE Employees ADD COLUMN probationPeriodMonths INT DEFAULT 0;');
        console.log('Added probationPeriodMonths to Employees');
    } catch (e) {
        console.log('probationPeriodMonths ignore:', e.message);
    }
    process.exit(0);
}
run();
