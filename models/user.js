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
        return new Promise((resolve, reject) => {
          bcrypt.compare(password, this.password, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
          });
        });
      },

      hashPassword() {
        return new Promise((resolve, reject) => {
          bcrypt.hash(this.password, 10, (err, res) => {
            if (err) return reject(err);

            this.password = res;
            return resolve(this);
          });
        });
      },
    },
  });
  return User;
};
