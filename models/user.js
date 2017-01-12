const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      },
    },
    instanceMethods: {
      isValidPassword(password) {
        return bcrypt.compareAsync(password, this.password);
      },

      hashPassword() {
        return bcrypt.hashAsync(this.password, 10)
          .then((res) => {
            this.password = res;
            return this;
          });
      },
    },
  });
  return User;
};
