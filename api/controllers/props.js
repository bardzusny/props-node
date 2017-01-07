const { Prop } = require('props-node/models');

const resource = {
  create(req, res) {
    Prop.create(req.body)
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
