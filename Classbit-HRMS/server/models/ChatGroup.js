const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ChatGroup = sequelize.define('ChatGroup', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    creatorId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = ChatGroup;
