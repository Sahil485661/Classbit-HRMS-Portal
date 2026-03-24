const fs = require('fs');
const path = require('path');
const { sequelize } = require('./models');

// Define loading order to be safe, though FK checks will be disabled
const loadOrder = [
    'Role',
    'User',
    'Department',
    'Employee',
    'Attendance',
    'AttendanceActivity',
    'Task',
    'TaskAssignment',
    'TaskAttachment',
    'LeaveRequest',
    'SalaryComponent',
    'PayrollRecord',
    'Loan',
    'Grievance',
    'Transaction',
    'Message',
    'Notice',
    'Setting',
    'Notification',
    'Objective',
    'Feedback',
    'Performance',
    'Job',
    'Candidate',
    'ActivityLog'
];

async function importData() {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL for import.');

        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        console.log('Disabled foreign key checks');

        const backupDir = path.join(__dirname, 'db_backup');
        
        let totalImported = 0;

        for (const modelName of loadOrder) {
            const filePath = path.join(backupDir, `${modelName}.json`);
            if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                if (data && data.length > 0) {
                    const model = sequelize.models[modelName];
                    console.log(`Importing ${data.length} records into ${modelName}...`);
                    
                    // Sanitize dates and handle boolean mappings if needed
                    const sanitizedData = data.map(record => {
                        // Some cleanup if needed, but bulkCreate manages properly if fields match schema
                        return record;
                    });
                    
                    await model.bulkCreate(sanitizedData, { validate: false, hooks: false });
                    totalImported += data.length;
                    console.log(`✓ ${modelName} imported`);
                } else {
                    console.log(`- ${modelName} is empty (skipped)`);
                }
            } else {
                console.warn(`! No backup file found for ${modelName}`);
            }
        }

        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Enabled foreign key checks');
        console.log(`\nImport completed successfully. Total records inserted: ${totalImported}`);
        process.exit(0);
    } catch (e) {
        console.error('Import failed:', e);
        try {
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        } catch(err) {}
        process.exit(1);
    }
}

importData();
