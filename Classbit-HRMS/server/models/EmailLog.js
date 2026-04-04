const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User'); // Using User.js for the sender/recipient context if needed

const EmailLog = sequelize.define('EmailLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    templateName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    recipientEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Sent', 'Failed'),
        allowNull: false
    },
    errorMsg: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    triggeredByObj: { // Can be string context e.g. "HR", "System", or userId JSON
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'email_logs',
    timestamps: true
});

module.exports = EmailLog;
