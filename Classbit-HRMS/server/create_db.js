const mysql = require('mysql2/promise');

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: ''
    });
    
    await connection.query('CREATE DATABASE IF NOT EXISTS hrms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    console.log('Database hrms created successfully');
    await connection.end();
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('MySQL connection refused. Could not create database via port 3306');
    } else {
      console.error('Error creating database:', error);
    }
  }
}

createDatabase();
