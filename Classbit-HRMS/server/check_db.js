const { sequelize, Attendance, AttendanceActivity } = require('./models');

async function check() {
    try {
        const attendanceColumns = await sequelize.getQueryInterface().describeTable('Attendances');
        console.log('Attendance columns:', Object.keys(attendanceColumns));
        
        const activityTableExists = await sequelize.getQueryInterface().showAllTables();
        console.log('Tables:', activityTableExists);

        if (activityTableExists.includes('AttendanceActivities')) {
            const activityColumns = await sequelize.getQueryInterface().describeTable('AttendanceActivities');
            console.log('AttendanceActivity columns:', Object.keys(activityColumns));
        } else {
            console.log('AttendanceActivities table NOT FOUND');
        }

        const today = new Date().toLocaleDateString('en-CA');
        console.log('Today (en-CA):', today);
        
        const lastRec = await Attendance.findOne({ order: [['id', 'DESC']] });
        if (lastRec) {
            console.log('Last Attendance Record:', lastRec.toJSON());
            
            // Re-fetch with Employee
            const { Employee, User } = require('./models');
            const fullRec = await Attendance.findByPk(lastRec.id, { 
                include: [{ model: Employee, include: [User] }] 
            });
            
            if (fullRec && fullRec.Employee && fullRec.Employee.User) {
                console.log('Full Record user details:', {
                    id: fullRec.Employee.User.id,
                    email: fullRec.Employee.User.email,
                    employeeId: fullRec.Employee.id
                });
                
                // --- TEST CONTROLLER LOGIC ---
                console.log('\n--- SIMULATING CONTROLLER CALL ---');
                const { updateStatus } = require('./controllers/attendanceController');
                
                const mockReq = {
                    user: {
                        id: fullRec.Employee.User.id,
                        employeeId: fullRec.Employee.id
                    },
                    body: { type: 'Tea Break' }
                };
                
                const mockRes = {
                    status: function(s) { 
                        console.log('RES STATUS:', s); 
                        return this; 
                    },
                    json: function(j) { 
                        console.log('RES JSON:', JSON.stringify(j, null, 2)); 
                        return this; 
                    }
                };
                
                try {
                    const countBefore = await AttendanceActivity.count();
                    console.log('Activity count BEFORE:', countBefore);
                    
                    await updateStatus(mockReq, mockRes);
                    
                    const countAfter = await AttendanceActivity.count();
                    console.log('Activity count AFTER:', countAfter);
                } catch (err) {
                    console.error('SIMULATION CRASHED:', err);
                }
            }
        }

    } catch (error) {
        console.error('Check failed:', error);
    } finally {
        process.exit();
    }
}

check();
