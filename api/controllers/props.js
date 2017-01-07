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

  query(req, res) {
    Prop.findAll()
      .then(props => res.status(200).send(props))
      .catch(err => res.status(500).send(err));
  },
};

module.exports = {
  create: resource.create,
  propsList: resource.query,
};
