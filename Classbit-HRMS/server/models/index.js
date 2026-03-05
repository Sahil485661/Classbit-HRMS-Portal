const { sequelize } = require('../config/db');
const User = require('./User');
const Role = require('./Role');
const Employee = require('./Employee');
const Department = require('./Department');
const Attendance = require('./Attendance');
const Task = require('./Task');
const TaskAssignment = require('./TaskAssignment');
const LeaveRequest = require('./LeaveRequest');
const SalaryComponent = require('./SalaryComponent');
const PayrollRecord = require('./PayrollRecord');
const Loan = require('./Loan');
const Grievance = require('./Grievance');
const Transaction = require('./Transaction');
const Message = require('./Message');
const Notice = require('./Notice');
const Performance = require('./Performance');
const Job = require('./Job');
const Candidate = require('./Candidate');
const ActivityLog = require('./ActivityLog');
const Setting = require('./Setting');
const Notification = require('./Notification');

// Associations

// Role - User (One-to-Many)
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

// User - Employee (One-to-One)
User.hasOne(Employee, { foreignKey: 'userId', onDelete: 'CASCADE' });
Employee.belongsTo(User, { foreignKey: 'userId' });

// Department - Employee (One-to-Many)
Department.hasMany(Employee, { foreignKey: 'departmentId' });
Employee.belongsTo(Department, { foreignKey: 'departmentId' });

// Employee - Attendance (One-to-Many)
Employee.hasMany(Attendance, { foreignKey: 'employeeId' });
Attendance.belongsTo(Employee, { foreignKey: 'employeeId' });

// Task - TaskAssignment (One-to-Many)
Task.hasMany(TaskAssignment, { foreignKey: 'taskId', onDelete: 'CASCADE' });
TaskAssignment.belongsTo(Task, { foreignKey: 'taskId' });

// Employee - TaskAssignment (One-to-Many)
Employee.hasMany(TaskAssignment, { foreignKey: 'employeeId' });
TaskAssignment.belongsTo(Employee, { foreignKey: 'employeeId' });

// Task - User (CreatedBy)
User.hasMany(Task, { foreignKey: 'createdBy' });
Task.belongsTo(User, { as: 'Creator', foreignKey: 'createdBy' });

// Employee - LeaveRequest (One-to-Many)
Employee.hasMany(LeaveRequest, { foreignKey: 'employeeId' });
LeaveRequest.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasOne(SalaryComponent, { foreignKey: 'employeeId' });
SalaryComponent.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasMany(PayrollRecord, { foreignKey: 'employeeId' });
PayrollRecord.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasMany(Loan, { foreignKey: 'employeeId' });
Loan.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasMany(Grievance, { foreignKey: 'employeeId' });
Grievance.belongsTo(Employee, { foreignKey: 'employeeId' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'SentMessages' });
User.hasMany(Message, { foreignKey: 'recipientId', as: 'ReceivedMessages' });
Message.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'Recipient', foreignKey: 'recipientId' });

Employee.hasMany(Performance, { foreignKey: 'employeeId' });
Performance.belongsTo(Employee, { foreignKey: 'employeeId' });

Job.hasMany(Candidate, { foreignKey: 'jobId' });
Candidate.belongsTo(Job, { foreignKey: 'jobId' });

// User - Notification (One-to-Many)
User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    sequelize,
    User,
    Role,
    Employee,
    Department,
    Attendance,
    Task,
    TaskAssignment,
    LeaveRequest,
    SalaryComponent,
    PayrollRecord,
    Loan,
    Grievance,
    Transaction,
    Message,
    Notice,
    Performance,
    Job,
    Candidate,
    ActivityLog,
    Setting,
    Notification
};
