const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Employee = sequelize.define('Employee', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    employeeId: {
        type: DataTypes.STRING, // External ID like EMP001
        allowNull: false,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: false
    },
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    joiningDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    emergencyContact: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive', 'On Leave', 'Terminated'),
        defaultValue: 'Active'
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Employee;
