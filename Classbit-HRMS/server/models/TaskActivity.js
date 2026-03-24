const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TaskActivity = sequelize.define('TaskActivity', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    taskId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
        // e.g., 'Created', 'Status Changed', 'Updated', 'Assigned'
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true
        // e.g., 'Status changed from Pending to In Progress'
    }
}, {
    timestamps: true
});

module.exports = TaskActivity;
