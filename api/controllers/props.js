const passport = require('passport');
const { Prop, User } = require('../../models');

const resource = {
  create(req, res) {
    const { propsed } = req.body;
    let createdProp;

    User.findAll({ where: { id: propsed } })
      .then((users) => {
        if (users.length !== propsed.length) return Promise.reject(404);
        return Prop.create(Object.assign({
          UserId: req.user.id,
        }, req.body));
      })
      .then((prop) => {
        createdProp = prop;
        return prop.setPropsed(propsed);
      })
      .then(() => Prop.find({
        where: { id: createdProp.id },
        include: [{
          model: User,
          as: 'propsed',
        }],
      }))
      .then((prop) => {
        res.status(201)
          .send(prop);
      })
      .catch((err) => {
        if (typeof err === 'number') return res.status(404).end();
        return res.status(500).end(err);
      });
  },

  query(req, res) {
    Prop.findAll({
      include: [User, {
        model: User,
        as: 'propsed',
        through: 'UsersPropsed',
      }],
    }).then(props => res.status(200).send(props))
      .catch(err => res.status(500).send(err));
  },
};

module.exports = {
  create(req, res) {
    passport.authenticate('bearer')(
      req, res, resource.create.bind(null, req, res)
    );
  },
  propsList(req, res) {
    passport.authenticate('bearer')(
      req, res, resource.query.bind(null, req, res)
    );
  },
};
