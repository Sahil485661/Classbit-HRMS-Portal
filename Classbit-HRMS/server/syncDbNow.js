require('dotenv').config();
const { sequelize } = require('./models');

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database tables verified/created successfully.');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Failed to sync database:', err);
        process.exit(1);
    });
