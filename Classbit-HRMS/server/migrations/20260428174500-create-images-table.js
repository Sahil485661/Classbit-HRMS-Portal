'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      public_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      entity_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      entity_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'general'
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      format: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('images', ['entity_type', 'entity_id'], {
      name: 'idx_images_entity'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('images', 'idx_images_entity');
    await queryInterface.dropTable('images');
  }
};
