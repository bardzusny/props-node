const chance = require('chance').Chance();
const bcrypt = require('bcrypt');
const sinon = require('sinon');
const { User } = require('../../models');

require('should');

describe('user model', () => {
  describe('hashPassword method', () => {
    before(() => {
      sinon.stub(bcrypt, 'hash').callsArgWith(2, null, '123');
    });

    after(() => {
      bcrypt.hash.restore();
    });

    it('hashes user instance password', (done) => {
      const userData = {
        username: chance.string(),
        password: chance.string(),
      };

      User.build(userData).hashPassword()
        .then((user) => {
          user.password.should.eql('123');
          done();
        });
    });
  });

  describe('isValidPassword method', () => {
    let user;

    before((done) => {
      User.build({ password: 'password' })
        .hashPassword()
        .then((freshUser) => {
          user = freshUser;
          done();
        });
    });

    describe('with invalid password', () => {
      it('returns promise resolving with "false" value', (done) => {
        user.isValidPassword('123password123')
          .then((result) => {
            result.should.eql(false);
            done();
          });
      });

      it('returns promise resolving with "true" value', (done) => {
        user.isValidPassword('password')
          .then((result) => {
            result.should.eql(true);
            done();
          });
      });
    });
  });
});
