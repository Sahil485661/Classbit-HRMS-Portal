const {
    Role, User, Department, Employee, Task, TaskAssignment,
    Notice, Transaction, SalaryComponent, Attendance, sequelize
} = require('./models');

const seedData = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database dropped and synced.');

        // 1. Roles
        const roles = await Role.bulkCreate([
            { name: 'Super Admin', description: 'Full system access' },
            { name: 'HR', description: 'Human Resource Management' },
            { name: 'Manager', description: 'Department/Team management' },
            { name: 'Employee', description: 'Regular staff access' }
        ]);

        // 2. Departments
        const depts = await Department.bulkCreate([
            { name: 'Software Development', description: 'Coding and Architecture' },
            { name: 'Human Resources', description: 'People management' },
            { name: 'Finance', description: 'Accounts and Payroll' },
            { name: 'Operations', description: 'Business Ops' }
        ]);

        // 3. Admin User
        const adminUser = await User.create({
            email: 'admin@classbit.com',
            password: 'password123',
            roleId: roles[0].id
        });

        const adminEmp = await Employee.create({
            userId: adminUser.id,
            employeeId: 'ADM001',
            firstName: 'System',
            lastName: 'Admin',
            gender: 'Male',
            joiningDate: new Date(),
            departmentId: depts[1].id,
            designation: 'Director',
            status: 'Active'
        });

        // 4. Sample Manager
        const managerUser = await User.create({
            email: 'manager@classbit.com',
            password: 'password123',
            roleId: roles[2].id
        });
        const managerEmp = await Employee.create({
            userId: managerUser.id,
            employeeId: 'MGR001',
            firstName: 'Robert',
            lastName: 'Wilson',
            gender: 'Male',
            joiningDate: new Date(),
            departmentId: depts[0].id,
            designation: 'Tech Lead',
            status: 'Active'
        });

        // 5. Sample Employee
        const empUser = await User.create({
            email: 'employee@classbit.com',
            password: 'password123',
            roleId: roles[3].id
        });
        const emp = await Employee.create({
            userId: empUser.id,
            employeeId: 'EMP001',
            firstName: 'Alice',
            lastName: 'Smith',
            gender: 'Female',
            joiningDate: new Date(),
            departmentId: depts[0].id,
            designation: 'Junior Developer',
            status: 'Active'
        });

        // 6. Salary Structure
        await SalaryComponent.create({
            employeeId: emp.id,
            baseSalary: 5000,
            payType: 'Monthly',
            allowances: { HRA: 500, Travel: 200 },
            deductions: { Tax: 450 }
        });

        // 7. Tasks
        const task = await Task.create({
            title: 'Implement Authentication',
            description: 'Setup JWT and Role based middleware',
            deadline: new Date(Date.now() + 86400000 * 3),
            priority: 'High',
            status: 'Open',
            createdBy: managerUser.id
        });
        await TaskAssignment.create({ taskId: task.id, employeeId: emp.id });

        // 8. Notices
        await Notice.create({
            type: 'Announcement',
            title: 'Welcoming New Batch',
            content: 'We are excited to welcome 10 new interns today!',
            isActive: true
        });
        await Notice.create({
            type: 'Quote',
            content: 'Innovation distinguishes between a leader and a follower.',
            author: 'Steve Jobs',
            isActive: true
        });

        // 9. Accounting
        await Transaction.create({
            type: 'Income',
            category: 'Service Contract',
            amount: 15000,
            date: new Date(),
            paymentMethod: 'Bank Transfer'
        });
        await Transaction.create({
            type: 'Expense',
            category: 'Rent',
            amount: 2500,
            date: new Date(),
            paymentMethod: 'Cash'
        });
        await Transaction.create({
            type: 'Expense',
            category: 'Payroll',
            amount: 4250,
            date: new Date(),
            paymentMethod: 'Bank Transfer'
        });

        // 10. More Attendance History (Last 5 days)
        const attendanceRecords = [];
        for (let i = 0; i < 5; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('en-CA');

            attendanceRecords.push({
                employeeId: emp.id,
                date: dateStr,
                checkIn: new Date(date.setHours(9, 0, 0, 0)),
                checkOut: new Date(date.setHours(17, 30, 0, 0)),
                status: 'Present',
                workingHours: 8.5
            });

            attendanceRecords.push({
                employeeId: adminEmp.id,
                date: dateStr,
                checkIn: new Date(date.setHours(8, 30, 0, 0)),
                checkOut: new Date(date.setHours(18, 0, 0, 0)),
                status: 'Present',
                workingHours: 9.5
            });
        }
        await Attendance.bulkCreate(attendanceRecords);

        console.log('All comprehensive test data seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
