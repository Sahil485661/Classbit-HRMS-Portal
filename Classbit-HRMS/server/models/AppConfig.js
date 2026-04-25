const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AppConfig = sequelize.define('AppConfig', {
    key: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = AppConfig;
