const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PayrollRecord = sequelize.define('PayrollRecord', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    employeeId: {
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
    grossSalary: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    totalDeductions: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    netSalary: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Generated', 'Locked', 'Paid'),
        defaultValue: 'Generated'
    },
    payslipUrl: {
        type: DataTypes.STRING,
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

module.exports = PayrollRecord;
