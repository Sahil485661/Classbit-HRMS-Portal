const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    senderId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    recipientId: {
        type: DataTypes.UUID,
        allowNull: true // Null if sent to department
    },
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    attachment: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

module.exports = Message;
