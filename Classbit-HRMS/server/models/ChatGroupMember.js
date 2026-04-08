const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ChatGroupMember = sequelize.define('ChatGroupMember', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    groupId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = ChatGroupMember;
