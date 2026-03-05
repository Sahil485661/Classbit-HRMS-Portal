const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Loan = sequelize.define('Loan', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    employeeId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    repaymentMonths: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    monthlyInstallment: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Completed'),
        defaultValue: 'Pending'
    },
    remainingAmount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
    }
}, {
    timestamps: true
});

module.exports = Loan;
