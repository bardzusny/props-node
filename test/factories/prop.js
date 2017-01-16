const { Prop } = require('../../models');
const chance = require('chance').Chance();

module.exports = {
  create(author, propsed) {
    let prop;
    return Prop.create({
      body: chance.string(),
      UserId: author.id,
    }).then((createdProp) => {
      prop = createdProp;
      // TODO: find a way to add belongsToMany associations within .create() call?
      return prop.addPropsed(propsed);
    }).then(() => prop);
  },
};
