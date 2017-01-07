const chance = require('chance').Chance();
const should = require('should');
const request = require('supertest');
const server = require('../../../app');
const UserFactory = require('../../factories/user');
const { Prop } = require('../../../models');
const authHelper = require('../../helpers/auth_helper');

describe('controllers', () => {
  describe('props', () => {
    before((done) => {
      Prop.destroy({ where: {} })
        .then(() => done());
    });

    describe('POST /props', () => {
      describe('without correct authentication header', () => {
        it('should respond with 401 unauthorized', (done) => {
          request(server)
            .post('/api/props')
            .send({ body: 'hello there' })
            .expect(401)
            .end(() => done());
        });
      });

      describe('with correct authentication header', () => {
        let token;
        let user;

        before((done) => {
          process.env.JWT_TOKEN = '123';
          const password = chance.string();

          UserFactory.create(password).then((createdUser) => {
            user = createdUser;
            return authHelper.fetchAuthorizationToken(user, password);
          }).then((authToken) => {
            token = authToken;
            done();
          });
        });

        it('should create new prop', (done) => {
          request(server)
            .post('/api/props')
            .set('Authorization', `Bearer ${token}`)
            .send({ body: 'hello world' })
            .expect(201)
            .end((err, res) => {
              should.not.exist(err);

              res.body.should.containEql({
                body: 'hello world',
                UserId: user.id,
              });

              Prop.findAll()
                .then((props) => {
                  props.length.should.eql(1);

                  done();
                });
            });
        });
      });
    });
  });
});
