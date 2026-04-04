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
    },
    fatherName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    motherName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    identityType: {
        type: DataTypes.ENUM('Aadhar', 'PAN', 'Voter ID', 'Driving License'),
        allowNull: true
    },
    identityNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    whatsappNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    linkedinProfile: {
        type: DataTypes.STRING,
        allowNull: true
    },
    maritalStatus: {
        type: DataTypes.ENUM('Single', 'Married', 'Divorced', 'Widowed'),
        allowNull: true
    },
    emergencyContactName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nationality: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bankName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bankAccountNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bankIfscCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    accountHolderName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    upiId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    probationPeriodMonths: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    trainingPeriodMonths: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: true,
    paranoid: true
});

module.exports = Employee;
