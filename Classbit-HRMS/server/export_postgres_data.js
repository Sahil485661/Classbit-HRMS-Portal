const fs = require('fs');
const path = require('path');
const { sequelize } = require('./models');

async function exportData() {
    try {
        await sequelize.authenticate();
        console.log('Connected to PostgreSQL for export.');
        const backupDir = path.join(__dirname, 'db_backup');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }

        const stats = {};
        for (const modelName in sequelize.models) {
            const model = sequelize.models[modelName];
            console.log(`Exporting ${modelName}...`);
            const records = await model.findAll({ raw: true });
            
            // Format dates or tricky types properly (raw:true helps, but maybe need fine-tuning)
            const filePath = path.join(backupDir, `${modelName}.json`);
            fs.writeFileSync(filePath, JSON.stringify(records, null, 2));
            stats[modelName] = records.length;
            console.log(`Exported ${records.length} records for ${modelName}.`);
        }
        
        fs.writeFileSync(path.join(backupDir, 'export_stats.json'), JSON.stringify(stats, null, 2));
        console.log('Export completed successfully. Check db_backup folder.');
        process.exit(0);
    } catch (e) {
        console.error('Export failed:', e);
        process.exit(1);
    }
}

exportData();
