const should = require('should');
const chance = require('chance').Chance();
const request = require('supertest');
const server = require('../../../app');
const UserFactory = require('../../factories/user');
const { User } = require('../../../models');
const jwt = require('jwt-simple');
const sinon = require('sinon');
const authHelper = require('../../helpers/auth_helper');

describe('controllers', () => {
  let token;
  let user;

  describe('users', () => {
    before((done) => {
      process.env.JWT_TOKEN = '123';
      const password = chance.string();

      User.destroy({ where: {} })
        .then(() => UserFactory.create(password))
        .then((createdUser) => {
          user = createdUser;
          return authHelper.fetchAuthorizationToken(user, password);
        }).then((authToken) => {
          token = authToken;
          done();
        });
    });

    describe('GET /users', () => {
      describe('without correct authentication header', () => {
        it('should return 401 unauthorized', (done) => {
          request(server)
            .get('/api/users')
            .send({ username: chance.name() })
            .expect(401)
            .end((err) => {
              should.not.exist(err);
              done();
            });
        });
      });

      describe('with correct authentication header', () => {
        it('should respond with list of users', (done) => {
          request(server)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((err, res) => {
              should.not.exist(err);

              User.findAll({})
                .then((users) => {
                  res.body.length.should.eql(users.length);
                  done();
                });
            });
        });
      });
    });

    describe('POST /users', () => {
      describe('with missing password', () => {
        it('should return 400 status code', (done) => {
          request(server)
            .post('/api/users')
            .send({ username: chance.name() })
            .expect(400)
            .end((err) => {
              should.not.exist(err);
              done();
            });
        });
      });

      describe('with correct params', () => {
        it('should create and respond with new user account', (done) => {
          const userData = {
            username: chance.name(),
            password: chance.string(),
          };
          request(server)
            .post('/api/users')
            .send(userData)
            .expect(201)
            .end((err, res) => {
              should.not.exist(err);

              res.body.username.should.eql(userData.username);
              res.body.password.should.not.eql(userData.password);

              User.find({ where: { id: res.body.id } })
                .then((registeredUser) => {
                  should.exist(registeredUser);
                  done();
                });
            });
        });
      });
    });

    describe('POST /users/login', () => {
      const password = chance.string();
      let registeredUser;

      before((done) => {
        UserFactory.create(password).then((createdUser) => {
          registeredUser = createdUser;
          done();
        });
      });

      describe('with incorrect login data', () => {
        it('should return 400 for missing password', (done) => {
          request(server)
            .post('/api/users/login')
            .send({ username: 'johndoe731' })
            .expect(400)
            .end((err) => {
              should.not.exist(err);

              done();
            });
        });

        it('should return 401 for non-existant user', (done) => {
          request(server)
            .post('/api/users/login')
            .send({ username: 'johndoe731', password: '123123123' })
            .expect(401)
            .end(() => done());
        });

        it('should return 401 for wrong password', (done) => {
          request(server)
            .post('/api/users/login')
            .send({ username: registeredUser.username, password: `${registeredUser.password}1` })
            .expect(401)
            .end(() => done());
        });
      });

      describe('with correct login data', () => {
        before(() => {
          sinon.stub(jwt, 'encode').returns('I am Mr. Token');
        });

        after(() => {
          jwt.encode.restore();
        });

        it('should return authentication token with user ID', (done) => {
          request(server)
            .post('/api/users/login')
            .send({ username: registeredUser.username, password })
            .expect(200)
            .end((err, res) => {
              should.not.exist(err);

              jwt.encode.calledWith({ id: registeredUser.id }).should.be.ok;
              res.body.should.eql({ token: 'I am Mr. Token' });

              done();
            });
        });
      });
    });
  });
});
