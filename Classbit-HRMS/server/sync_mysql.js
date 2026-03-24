const { sequelize } = require('./models');

async function syncDB() {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL via Sequelize');
        
        await sequelize.sync({ force: true });
        console.log('MySQL Database schema successfully generated.');
        
        const tables = await sequelize.getQueryInterface().showAllTables();
        console.log('Generated tables in MySQL:', tables);
        process.exit(0);
    } catch (e) {
        console.error('Schema sync failed:', e);
        process.exit(1);
    }
}

syncDB();
