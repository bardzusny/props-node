const request = require('supertest');
const server = require('../../app');

module.exports = {
  fetchAuthorizationToken(user, password) {
    return new Promise((resolve, reject) => {
      request(server)
        .post('/api/users/login')
        .send({ username: user.username, password })
        .end((err, res) => {
          if (err) return reject(err);
          return resolve(res.body.token);
        });
    });
  },
};
