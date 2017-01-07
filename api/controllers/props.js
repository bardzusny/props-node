const { Prop } = require('props-node/models');

const resource = {
  create(req, res) {
    const propData = Object.assign({
      UserId: req.user.id,
    }, req.body);

    Prop.create(propData)
      .then((prop) => {
        res
          .status(201)
          .send(prop);
      });
  },
};

module.exports = {
  create: resource.create,
};
