const should = require('should');
const request = require('supertest');
const server = require('../../../app');
const { Prop, User } = require('../../../models');
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

          User.create({
            username: 'john.doe',
            password: '123QWEasd',
          }).then((createdUser) => {
            user = createdUser;
            return authHelper.fetchAuthorizationToken(user);
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

              res.body.should.containEql({ body: 'hello world' });

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
