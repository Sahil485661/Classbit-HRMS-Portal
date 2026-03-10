const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('Task', 'Leave', 'Grievance', 'General', 'System'),
        defaultValue: 'General'
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    relatedId: {
        type: DataTypes.STRING, // Can store Task ID or Leave ID for navigation
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Notification;
