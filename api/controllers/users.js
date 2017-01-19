const { User } = require('../../models');
const jwt = require('jwt-simple');
const passport = require('passport');

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
  login(req, res) {
    passport.authenticate('local')(
      req, res, resource.login.bind(null, req, res)
    );
  },
  userRegister: resource.create,
  usersList(req, res) {
    passport.authenticate('bearer')(
      req, res, resource.query.bind(null, req, res)
    );
  },
};
