'use strict';
module.exports = function(sequelize, DataTypes) {
  var UsersPropsed = sequelize.define('UsersPropsed', {}, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return UsersPropsed;
};
