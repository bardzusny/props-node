'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Props',
      'UserId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn(
      'Props',
      'UserId'
    );
  }
};
