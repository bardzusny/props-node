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
});
