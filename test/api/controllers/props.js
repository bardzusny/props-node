const should = require('should');
const request = require('supertest');
const server = require('../../../app');
const { Prop } = require('../../../models');

describe('controllers', () => {
  describe('props', () => {
    before((done) => {
      Prop.destroy({ where: {} })
        .then(() => done());
    });

    describe('POST /props', () => {
      it('should create new prop', (done) => {
        request(server)
          .post('/api/props')
          .send({ body: 'hello there' })
          .expect(201)
          .end((err, res) => {
            should.not.exist(err);

            res.body.should.containEql({ body: 'hello there' });

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
