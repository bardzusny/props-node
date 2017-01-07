const jwt = require('jwt-simple');

const resource = {
  login(req, res) {
    const token = jwt.encode({ id: req.user.id }, process.env.JWT_TOKEN);
    res.status(200).send({ token });
  },
};

module.exports = {
  login: resource.login,
};
