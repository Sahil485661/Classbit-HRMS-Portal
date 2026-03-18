const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Feedback = sequelize.define('Feedback', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    targetEmployeeId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    authorId: { // User ID of the person giving feedback
        type: DataTypes.UUID,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tags: {
        type: DataTypes.JSONB, // e.g., ["#Leadership", "#Technical"]
        defaultValue: []
    },
    type: {
        type: DataTypes.ENUM('Manager', 'Peer', 'Self', 'System'),
        defaultValue: 'Manager'
    }
}, {
    timestamps: true
});

module.exports = Feedback;
