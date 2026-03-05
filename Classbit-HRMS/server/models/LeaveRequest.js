const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LeaveRequest = sequelize.define('LeaveRequest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    employeeId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    leaveTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Cancelled'),
        defaultValue: 'Pending'
    },
    approvedBy: {
        type: DataTypes.UUID, // User ID of Manager/HR
        allowNull: true
    },
    approvalDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = LeaveRequest;
