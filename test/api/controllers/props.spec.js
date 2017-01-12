const chance = require('chance').Chance();
const should = require('should');
const request = require('supertest');
const server = require('../../../app');
const PropFactory = require('../../factories/prop');
const UserFactory = require('../../factories/user');
const { Prop } = require('../../../models');
const authHelper = require('../../helpers/auth_helper');

describe('controllers', () => {
  let token;
  let user;
  let propsedUser;

  before((done) => {
    process.env.JWT_TOKEN = '123';
    const password = chance.string();

    UserFactory.create(password).then((createdUser) => {
      user = createdUser;
      return authHelper.fetchAuthorizationToken(user, password);
    }).then((authToken) => {
      token = authToken;
      return UserFactory.create();
    }).then((createdUser) => {
      propsedUser = createdUser;
      done();
    });
  });

  describe('props', () => {
    before(() => Prop.destroy({ where: {} }));

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
        it('should respond with 400 for request without propsed users', (done) => {
          request(server)
            .post('/api/props')
            .set('Authorization', `Bearer ${token}`)
            .send({ body: 'hello world' })
            .expect(400)
            .end((err) => {
              should.not.exist(err);

              done();
            });
        });

        it('should respond with 404 for request with fictional propsed users', (done) => {
          request(server)
            .post('/api/props')
            .set('Authorization', `Bearer ${token}`)
            .send({ body: 'hello world', propsed: [999999] })
            .expect(404)
            .end((err) => {
              should.not.exist(err);

              done();
            });
        });

        it('should create new prop', (done) => {
          request(server)
            .post('/api/props')
            .set('Authorization', `Bearer ${token}`)
            .send({ body: 'hello world', propsed: [propsedUser.id] })
            .expect(201)
            .end((err, res) => {
              should.not.exist(err);

              res.body.should.containEql({
                body: 'hello world',
                UserId: user.id,
              });
              res.body.propsed.length.should.eql(1);
              res.body.propsed[0].id.should.eql(propsedUser.id);

              Prop.findAll()
                .then((props) => {
                  props.length.should.eql(1);

                  done();
                });
            });
        });
      });
    });

    describe('GET /props', () => {
      let prop1;
      let prop2;

      before((done) => {
        Prop.destroy({ where: {} })
          .then(() => PropFactory.create(user))
          .then((prop) => {
            prop1 = prop;
            return PropFactory.create(user);
          })
          .then((prop) => {
            prop2 = prop;
            done();
          });
      });

      describe('without correct authentication header', () => {
        it('should respond with 401 unauthorized', (done) => {
          request(server)
            .get('/api/props')
            .expect(401)
            .end(() => done());
        });
      });

      describe('with correct authentication header', () => {
        it('should respond with list of existing props', (done) => {
          request(server)
            .get('/api/props')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((err, res) => {
              should.not.exist(err);

              res.body.length.should.eql(2);
              res.body[0].id.should.eql(prop1.id);
              res.body[1].id.should.eql(prop2.id);

              done();
            });
        });
      });
    });
  });
});
