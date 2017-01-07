const request = require('supertest');
const server = require('../../app');

module.exports = {
  fetchAuthorizationToken(user) {
    return new Promise((resolve) => {
      request(server)
        .post('/api/users/login')
        .send({ username: user.username, password: user.password })
        .end((err, res) => resolve(res.body.token));
    });
  },
};
