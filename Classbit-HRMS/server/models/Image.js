const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  public_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entity_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entity_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING, // e.g. 'profile', 'document', 'gallery'
    allowNull: true,
    defaultValue: 'general'
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  format: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'images',
  timestamps: true,
  paranoid: true, // Enables soft deletes (deletedAt)
  indexes: [
    {
      name: 'idx_images_entity',
      fields: ['entity_type', 'entity_id']
    }
  ]
});

module.exports = Image;
