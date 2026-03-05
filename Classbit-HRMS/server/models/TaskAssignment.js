const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TaskAssignment = sequelize.define('TaskAssignment', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    taskId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    employeeId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    assignedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});

module.exports = TaskAssignment;
