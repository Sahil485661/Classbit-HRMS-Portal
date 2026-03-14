const { sequelize } = require('./config/db');

async function inspect() {
  try {
    await sequelize.authenticate();
    console.log('--- Database Inspection ---');
    
    const [tables] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log('Found tables:', tables);
    
    for (const row of tables) {
        const tableName = typeof row === 'string' ? row : row.table_name;
        const [countRow] = await sequelize.query(`SELECT count(*) FROM "${tableName}"`);
        console.log(`Table "${tableName}" has ${countRow[0].count} rows.`);
    }
    
    // Check if Employees table exists and has data
    if (tables.some(t => t.table_name === 'Employees')) {
        const [employees] = await sequelize.query('SELECT * FROM "Employees" LIMIT 1');
        console.log('Sample Employee:', employees[0]);
    }

    process.exit(0);
  } catch (error) {
    console.error('Inspection failed:', error);
    process.exit(1);
  }
}

inspect();
