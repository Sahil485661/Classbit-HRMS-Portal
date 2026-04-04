require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');
const models = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/payroll', require('./routes/payrollRoutes'));
app.use('/api/leave', require('./routes/leaveRoutes'));
app.use('/api/loan', require('./routes/loanRoutes'));
app.use('/api/grievance', require('./routes/grievanceRoutes'));
app.use('/api/accounting', require('./routes/accountingRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/setup/compliance', require('./routes/complianceRoutes'));
app.use('/api/setup', require('./routes/setupRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/salary', require('./routes/salaryRoutes'));
app.use('/api/reimbursements', require('./routes/reimbursementRoutes'));
app.use('/api/email-settings', require('./routes/emailSettingsRoutes'));
app.use('/api/email-actions', require('./routes/emailActionsRoutes'));

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Classbit HRMS API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    // Sync database 
    // In production, use migrations. For testing, sync:
    if (process.env.NODE_ENV === 'development') {
        await sequelize.sync({ alter: true });
        console.log('Database synced');
    }

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
