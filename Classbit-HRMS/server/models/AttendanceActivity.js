const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AttendanceActivity = sequelize.define('AttendanceActivity', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    attendanceId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false // e.g., 'Working', 'Tea Break', 'Lunch Break'
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    duration: {
        type: DataTypes.INTEGER, // duration in minutes
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = AttendanceActivity;
