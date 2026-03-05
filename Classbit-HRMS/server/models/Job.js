const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Job = sequelize.define('Job', {
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
        allowNull: false
    },
    requirements: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Open', 'Closed', 'On Hold'),
        defaultValue: 'Open'
    },
    type: {
        type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Internship'),
        defaultValue: 'Full-time'
    },
    salaryRange: {
        type: DataTypes.STRING,
        allowNull: true
    },
    expiryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Job;
