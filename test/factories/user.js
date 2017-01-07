const { User } = require('props-node/models');
const chance = require('chance').Chance();

module.exports = {
  create(password = chance.string()) {
    return User.build({
      username: chance.name(),
      password,
    }).hashPassword()
      .then(user => user.save());
  },
};
