const {
    Role, User, Department, Employee, Task, TaskAssignment,
    Notice, Transaction, SalaryComponent, Attendance, Message, sequelize
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
            { name: 'Operations', description: 'Business Ops' },
            { name: 'Marketing', description: 'Brand and Growth' },
            { name: 'Customer Support', description: 'Client Success' },
            { name: 'IT Infrastructure', description: 'Network and Security' }
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

        // 5. Sample Employees
        const employeeData = [
            { email: 'employee@classbit.com', role: roles[3], empId: 'EMP001', first: 'Alice', last: 'Smith', dept: depts[0], desig: 'Junior Developer', gender: 'Female' },
            { email: 'sarah.m@classbit.com', role: roles[3], empId: 'EMP002', first: 'Sarah', last: 'Miller', dept: depts[4], desig: 'Marketing Specialist', gender: 'Female' },
            { email: 'john.d@classbit.com', role: roles[3], empId: 'EMP003', first: 'John', last: 'Doe', dept: depts[5], desig: 'Support Agent', gender: 'Male' },
            { email: 'david.k@classbit.com', role: roles[3], empId: 'EMP004', first: 'David', last: 'Knight', dept: depts[6], desig: 'System Engineer', gender: 'Male' },
            { email: 'emily.w@classbit.com', role: roles[2], empId: 'EMP005', first: 'Emily', last: 'Watson', dept: depts[1], desig: 'HR Manager', gender: 'Female' },
            { email: 'alex.h@classbit.com', role: roles[3], empId: 'EMP006', first: 'Alex', last: 'Hunter', dept: depts[0], desig: 'UI/UX Designer', gender: 'Other' }
        ];

        const createdEmps = [];
        for (const data of employeeData) {
            const user = await User.create({
                email: data.email,
                password: 'password123',
                roleId: data.role.id
            });
            const emp = await Employee.create({
                userId: user.id,
                employeeId: data.empId,
                firstName: data.first,
                lastName: data.last,
                gender: data.gender,
                joiningDate: new Date(),
                departmentId: data.dept.id,
                designation: data.desig,
                status: 'Active'
            });
            createdEmps.push(emp);

            // Add Salary Component
            await SalaryComponent.create({
                employeeId: emp.id,
                baseSalary: 4000 + Math.random() * 2000,
                payType: 'Monthly'
            });
        }

        const emp = createdEmps[0]; // Alice

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
        await Transaction.create({ type: 'Income', category: 'Service Contract', amount: 15000, date: new Date(), paymentMethod: 'Bank Transfer' });
        await Transaction.create({ type: 'Expense', category: 'Rent', amount: 2500, date: new Date(), paymentMethod: 'Cash' });
        await Transaction.create({ type: 'Expense', category: 'Payroll', amount: 4250, date: new Date(), paymentMethod: 'Bank Transfer' });

        // 10. Attendance Records
        for (const targetEmp of [emp, adminEmp, managerEmp]) {
            const records = [];
            for (let i = 0; i < 5; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                records.push({
                    employeeId: targetEmp.id,
                    date: date.toLocaleDateString('en-CA'),
                    checkIn: new Date(date.setHours(9, 0, 0, 0)),
                    checkOut: new Date(date.setHours(17, 30, 0, 0)),
                    status: 'Present',
                    workingHours: 8.5
                });
            }
            await Attendance.bulkCreate(records);
        }
        
        // 11. Sample Messages
        await Message.create({ senderId: managerUser.id, recipientId: emp.userId, content: 'Hi Alice, how is the authentication task going?' });
        await Message.create({ senderId: emp.userId, recipientId: managerUser.id, content: 'Hey Robert, it is going well.', isRead: true });
        
        console.log('All comprehensive test data seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
