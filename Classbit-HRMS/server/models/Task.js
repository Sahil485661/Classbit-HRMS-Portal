const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false
    },
    priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
        defaultValue: 'Medium'
    },
    status: {
        type: DataTypes.ENUM('Open', 'In Progress', 'Completed', 'On Hold'),
        defaultValue: 'Open'
    },
    attachment: {
        type: DataTypes.STRING, // File path
        allowNull: true
    },
    createdBy: {
        type: DataTypes.UUID, // Link to User (Manager/Admin)
        allowNull: false
    },
    assignmentType: {
        type: DataTypes.STRING,
        defaultValue: 'Single' // 'Single', 'Multiple', 'Department', 'All'
    },
    assignedDepartmentId: {
        type: DataTypes.INTEGER,
        allowNull: true // Only populated if assignmentType === 'Department'
    }
}, {
    timestamps: true
});

module.exports = Task;
