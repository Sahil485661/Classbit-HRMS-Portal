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
const ActivityLog = require('./ActivityLog');
const Setting = require('./Setting');
const Notification = require('./Notification');
const EmailTemplate = require('./EmailTemplate');
const EmailLog = require('./EmailLog');
const AttendanceActivity = require('./AttendanceActivity');
const TaskAttachment = require('./TaskAttachment');
const TaskActivity = require('./TaskActivity');
const TaskComment = require('./TaskComment');
const ReimbursementCategory = require('./ReimbursementCategory');
const ReimbursementClaim = require('./ReimbursementClaim');
const ChatGroup = require('./ChatGroup');
const ChatGroupMember = require('./ChatGroupMember');
const Meeting = require('./Meeting');
const Company = require('./Company');
const AppConfig = require('./AppConfig');
const Image = require('./Image');

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

// Employee - Employee (Manager-to-Subordinate)
Employee.belongsTo(Employee, { as: 'Manager', foreignKey: 'managerId' });
Employee.hasMany(Employee, { as: 'Subordinates', foreignKey: 'managerId' });

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

// Task - TaskActivity (One-to-Many)
Task.hasMany(TaskActivity, { foreignKey: 'taskId', onDelete: 'CASCADE' });
TaskActivity.belongsTo(Task, { foreignKey: 'taskId' });

// Task - TaskComment (One-to-Many)
Task.hasMany(TaskComment, { foreignKey: 'taskId', onDelete: 'CASCADE' });
TaskComment.belongsTo(Task, { foreignKey: 'taskId' });

// User - TaskActivity
User.hasMany(TaskActivity, { foreignKey: 'userId', onDelete: 'CASCADE' });
TaskActivity.belongsTo(User, { as: 'User', foreignKey: 'userId' });

// User - TaskComment
User.hasMany(TaskComment, { foreignKey: 'userId', onDelete: 'CASCADE' });
TaskComment.belongsTo(User, { as: 'User', foreignKey: 'userId' });

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

// ChatGroup Associations
User.hasMany(ChatGroup, { foreignKey: 'creatorId' });
ChatGroup.belongsTo(User, { as: 'Creator', foreignKey: 'creatorId' });

ChatGroup.hasMany(ChatGroupMember, { foreignKey: 'groupId', onDelete: 'CASCADE' });
ChatGroupMember.belongsTo(ChatGroup, { foreignKey: 'groupId' });

User.hasMany(ChatGroupMember, { foreignKey: 'userId', onDelete: 'CASCADE' });
ChatGroupMember.belongsTo(User, { foreignKey: 'userId' });

ChatGroup.hasMany(Message, { foreignKey: 'groupId', onDelete: 'CASCADE' });
Message.belongsTo(ChatGroup, { foreignKey: 'groupId' });

// User - Notification (One-to-Many)
User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// User - ActivityLog (One-to-Many)
User.hasMany(ActivityLog, { foreignKey: 'userId', onDelete: 'CASCADE' });
ActivityLog.belongsTo(User, { foreignKey: 'userId' });

// Reimbursement Associations
ReimbursementCategory.hasMany(ReimbursementClaim, { foreignKey: 'categoryId' });
ReimbursementClaim.belongsTo(ReimbursementCategory, { foreignKey: 'categoryId' });

Employee.hasMany(ReimbursementClaim, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
ReimbursementClaim.belongsTo(Employee, { foreignKey: 'employeeId' });

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
    ActivityLog,
    Setting,
    Notification,
    EmailTemplate,
    EmailLog,
    AttendanceActivity,
    TaskAttachment,
    TaskActivity,
    TaskComment,
    ReimbursementCategory,
    ReimbursementClaim,
    ChatGroup,
    ChatGroupMember,
    Meeting,
    Company,
    AppConfig,
    Image
};
