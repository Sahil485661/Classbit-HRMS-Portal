const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Objective = sequelize.define('Objective', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    employeeId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    progress: {
        type: DataTypes.INTEGER, // 0 to 100
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    status: {
        type: DataTypes.ENUM('On-Track', 'At-Risk', 'Lagging', 'Completed'),
        defaultValue: 'On-Track'
    },
    deadline: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Objective;
