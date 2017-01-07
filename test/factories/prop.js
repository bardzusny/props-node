const { Prop } = require('props-node/models');
const chance = require('chance').Chance();

module.exports = {
  create(author) {
    return Prop.create({
      body: chance.string(),
      UserId: author.id,
    });
  },
};
