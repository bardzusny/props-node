const { User } = require('props-node/models');
const chance = require('chance').Chance();

module.exports = {
  create() {
    return User.create({
      username: chance.name(),
      password: chance.string(),
    });
  },
};
