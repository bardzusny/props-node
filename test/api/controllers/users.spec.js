const should = require('should');
const request = require('supertest');
const server = require('../../../app');
const UserFactory = require('../../factories/user');
const { User } = require('../../../models');
const jwt = require('jwt-simple');
const sinon = require('sinon');

describe('controllers', () => {
  describe('users', () => {
    before((done) => {
      User.destroy({ where: {} })
        .then(() => done());
    });

    describe('POST /users/login', () => {
      let user;

      before((done) => {
        UserFactory.create().then((createdUser) => {
          user = createdUser;
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
            .send({ username: user.username, password: `${user.password}1` })
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
            .send({ username: user.username, password: user.password })
            .expect(200)
            .end((err, res) => {
              should.not.exist(err);

              jwt.encode.calledWith({ id: user.id }).should.be.ok;
              res.body.should.eql({ token: 'I am Mr. Token' });

              done();
            });
        });
      });
    });
  });
});
