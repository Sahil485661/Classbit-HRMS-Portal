const { Employee, User, Task, sequelize } = require('./models');

async function verify() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    const userCount = await User.count();
    const employeeCount = await Employee.count();
    const taskCount = await Task.count();
    
    console.log('--- Database Verification ---');
    console.log('Users:', userCount);
    console.log('Employees:', employeeCount);
    console.log('Tasks:', taskCount);
    console.log('-----------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

verify();
