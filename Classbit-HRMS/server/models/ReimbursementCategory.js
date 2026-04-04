const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ReimbursementCategory = sequelize.define('ReimbursementCategory', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    maxLimit: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0 // 0 means no limit
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = ReimbursementCategory;
