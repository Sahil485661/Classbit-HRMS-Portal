const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ReimbursementClaim = sequelize.define('ReimbursementClaim', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    employeeId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    expenseDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    receiptUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Pending', 'HR_Approved', 'Finance_Verified', 'Paid', 'Rejected'),
        defaultValue: 'Pending'
    },
    hrRemarks: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    financeRemarks: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    hrApproverId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    financeApproverId: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = ReimbursementClaim;
