const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    employeeId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    checkIn: {
        type: DataTypes.DATE,
        allowNull: true
    },
    checkOut: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Present', 'Absent', 'Late', 'Half Day', 'Holiday'),
        defaultValue: 'Present'
    },
    workingHours: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0.00
    },
    overtime: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0.00
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    currentStatus: {
        type: DataTypes.STRING,
        defaultValue: 'Working'
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['employeeId', 'date']
        }
    ]
});

module.exports = Attendance;
