const { Client } = require('pg');
require('dotenv').config();

const createDb = async () => {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'postgres' // Connect to default db
    });

    try {
        await client.connect();
        await client.query('CREATE DATABASE classbit_hrms');
        console.log('Database classbit_hrms created successfully');
    } catch (err) {
        if (err.code === '42P04') {
            console.log('Database classbit_hrms already exists');
        } else {
            console.error('Error creating database:', err);
        }
    } finally {
        await client.end();
    }
};

createDb();
