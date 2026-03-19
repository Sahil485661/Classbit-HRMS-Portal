const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Performance = sequelize.define('Performance', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    employeeId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    reviewerId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    month: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ratings: {
        type: DataTypes.JSON, // { productivity: 5, communication: 4, technical: 4 }
        allowNull: false
    },
    overallScore: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false
    },
    feedback: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // 9-Box Grid metrics
    potentialScore: { // 1: Low, 2: Moderate, 3: High
        type: DataTypes.INTEGER,
        defaultValue: 2,
        validate: { min: 1, max: 3 }
    },
    performanceScore: { // 1: Below, 2: Meets, 3: Exceeds (Often derived from overallScore)
        type: DataTypes.INTEGER,
        defaultValue: 2,
        validate: { min: 1, max: 3 }
    },
    // Self Appraisal
    selfAppraisalText: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    employeeAgreed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['employeeId', 'month', 'year']
        }
    ]
});

module.exports = Performance;
