const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Grievance = sequelize.define('Grievance', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    employeeId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAnonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Open', 'In Progress', 'Resolved', 'Closed'),
        defaultValue: 'Open'
    },
    response: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    resolvedBy: {
        type: DataTypes.UUID, // User ID of Admin/HR
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Grievance;
