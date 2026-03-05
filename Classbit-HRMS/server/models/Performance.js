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
        allowNull: false
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
        type: DataTypes.JSONB, // { productivity: 5, communication: 4, technical: 4 }
        allowNull: false
    },
    overallScore: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false
    },
    feedback: {
        type: DataTypes.TEXT,
        allowNull: true
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
