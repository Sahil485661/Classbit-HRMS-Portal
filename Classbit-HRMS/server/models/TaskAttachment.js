const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TaskAttachment = sequelize.define('TaskAttachment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    taskId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    uploaderId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    originalName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fileType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fileSize: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = TaskAttachment;
