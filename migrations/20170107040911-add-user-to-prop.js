'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Props',
      'UserId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'Props',
      'UserId'
    );
  }
};
