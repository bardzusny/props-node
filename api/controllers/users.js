const { User } = require('../../models');
const jwt = require('jwt-simple');

const resource = {
  login(req, res) {
    const token = jwt.encode({ id: req.user.id }, process.env.JWT_TOKEN);
    res.status(200).send({ token });
  },

  create(req, res) {
    User.build(req.body)
      .hashPassword()
      .then(user => user.save())
      .then(user => res.status(201).send(user))
      .catch(err => res.status(500).send(err));
  },

  query(req, res) {
    User.findAll({})
      .then(users => res.status(200).send(users))
      .catch(err => res.status(500).send(err));
  },
};

module.exports = {
  login: resource.login,
  userRegister: resource.create,
  usersList: resource.query,
};
