const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Candidate = sequelize.define('Candidate', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    jobId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resume: {
        type: DataTypes.STRING, // File path
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Applied', 'Shortlisted', 'Interviewing', 'Selected', 'Rejected'),
        defaultValue: 'Applied'
    },
    interviewDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    assessmentScore: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Candidate;
