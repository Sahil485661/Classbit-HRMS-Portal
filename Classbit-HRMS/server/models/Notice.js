const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Notice = sequelize.define('Notice', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    type: {
        type: DataTypes.ENUM('Announcement', 'Quote', 'Notice'),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: true
    },
    expiryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    eventDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = Notice;
