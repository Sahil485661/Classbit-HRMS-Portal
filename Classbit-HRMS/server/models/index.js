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
const AttendanceActivity = require('./AttendanceActivity');
const TaskAttachment = require('./TaskAttachment');
const Objective = require('./Objective');
const Feedback = require('./Feedback');

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
Employee.hasMany(Attendance, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
Attendance.belongsTo(Employee, { foreignKey: 'employeeId' });

// Attendance - AttendanceActivity (One-to-Many)
Attendance.hasMany(AttendanceActivity, { foreignKey: 'attendanceId', onDelete: 'CASCADE' });
AttendanceActivity.belongsTo(Attendance, { foreignKey: 'attendanceId' });

// Task - TaskAssignment (One-to-Many)
Task.hasMany(TaskAssignment, { foreignKey: 'taskId', onDelete: 'CASCADE' });
TaskAssignment.belongsTo(Task, { foreignKey: 'taskId' });

// Employee - TaskAssignment (One-to-Many)
Employee.hasMany(TaskAssignment, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
TaskAssignment.belongsTo(Employee, { foreignKey: 'employeeId' });

// Task - User (CreatedBy)
User.hasMany(Task, { foreignKey: 'createdBy', onDelete: 'CASCADE' });
Task.belongsTo(User, { as: 'Creator', foreignKey: 'createdBy' });

// Task - TaskAttachment (One-to-Many)
Task.hasMany(TaskAttachment, { foreignKey: 'taskId', onDelete: 'CASCADE' });
TaskAttachment.belongsTo(Task, { foreignKey: 'taskId' });

// User - TaskAttachment (Uploader)
User.hasMany(TaskAttachment, { foreignKey: 'uploaderId', onDelete: 'CASCADE' });
TaskAttachment.belongsTo(User, { as: 'Uploader', foreignKey: 'uploaderId' });

// Task - Department (Assigned Department)
Department.hasMany(Task, { foreignKey: 'assignedDepartmentId' });
Task.belongsTo(Department, { as: 'AssignedDepartment', foreignKey: 'assignedDepartmentId' });

// Employee - LeaveRequest (One-to-Many)
Employee.hasMany(LeaveRequest, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
LeaveRequest.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasOne(SalaryComponent, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
SalaryComponent.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasMany(PayrollRecord, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
PayrollRecord.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasMany(Loan, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
Loan.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasMany(Grievance, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
Grievance.belongsTo(Employee, { foreignKey: 'employeeId' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'SentMessages', onDelete: 'CASCADE' });
User.hasMany(Message, { foreignKey: 'recipientId', as: 'ReceivedMessages', onDelete: 'CASCADE' });
Message.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'Recipient', foreignKey: 'recipientId' });

Employee.hasMany(Performance, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
Performance.belongsTo(Employee, { foreignKey: 'employeeId' });

Job.hasMany(Candidate, { foreignKey: 'jobId' });
Candidate.belongsTo(Job, { foreignKey: 'jobId' });

// User - Notification (One-to-Many)
User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// Employee - Objective (One-to-Many)
Employee.hasMany(Objective, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
Objective.belongsTo(Employee, { foreignKey: 'employeeId' });

// Employee - Feedback (Target)
Employee.hasMany(Feedback, { foreignKey: 'targetEmployeeId', onDelete: 'CASCADE' });
Feedback.belongsTo(Employee, { as: 'TargetEmployee', foreignKey: 'targetEmployeeId' });

// User - Feedback (Author)
User.hasMany(Feedback, { foreignKey: 'authorId', onDelete: 'CASCADE' });
Feedback.belongsTo(User, { as: 'Author', foreignKey: 'authorId' });

// User - Performance (Reviewer)
User.hasMany(Performance, { foreignKey: 'reviewerId', onDelete: 'SET NULL' });
Performance.belongsTo(User, { as: 'Reviewer', foreignKey: 'reviewerId' });

// User - ActivityLog (One-to-Many)
User.hasMany(ActivityLog, { foreignKey: 'userId', onDelete: 'CASCADE' });
ActivityLog.belongsTo(User, { foreignKey: 'userId' });

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
    Notification,
    AttendanceActivity,
    TaskAttachment,
    Objective,
    Feedback
};
