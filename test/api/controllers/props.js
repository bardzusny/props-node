const should = require('should');
const request = require('supertest');
const server = require('../../../app');

describe('controllers', () => {
  describe('props', () => {
    describe('POST /props', () => {
      it('should return prop with same data as given in request body', (done) => {
        request(server)
          .post('/api/props')
          .send({ body: 'hello there' })
          .expect(201)
          .end((err, res) => {
            should.not.exist(err);

            res.body.should.eql({ body: 'hello there' });

            done();
          });
      });
    });
  });
});
