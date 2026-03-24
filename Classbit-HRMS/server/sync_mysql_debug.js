const { sequelize } = require('./models');

async function syncDB() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
        console.log('MySQL Database schema successfully generated.');
        process.exit(0);
    } catch (e) {
        console.error('SQL:', e.sql);
        console.error('Message:', e.original ? e.original.message : e.message);
        process.exit(1);
    }
}

syncDB();
