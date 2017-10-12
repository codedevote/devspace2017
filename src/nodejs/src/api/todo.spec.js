const { expect } = require('chai');
const request = require('supertest');

const app = require('../server');

describe('/api/todo', () => {
  describe('when having no todo items', () => {
    it('GET /api/todo should return empty array', () =>
      request(app)
        .get('/api/todo')
        .expect(200)
        .expect(({ body }) => {
          expect(body).to.be.an('array');
          expect(body).to.be.empty;
        }));
  });

  describe('when creating a todo item', () => {
    let todoItem;
    before(() =>
      request(app)
        .post('/api/todo')
        .send({ name: 'hello' })
        .expect(200)
        .expect(({ body }) => {
          expect(body).to.be.an('object');
          expect(body.id).to.be.equal(1);
          expect(body.name).to.be.equal('hello');
          todoItem = body;
        }));

    describe('and requesting todo item by known id', () => {
      it('GET /api/todo should return expected item', () =>
        request(app)
          .get('/api/todo')
          .expect(200)
          .expect(({ body }) => {
            expect(body).to.be.an('array');
            expect(body).to.have.length(1);
            expect(body[0]).to.be.deep.equal(todoItem);
          }));

      it('GET /api/todo/:id should return expected item', () =>
        request(app)
          .get(`/api/todo/${todoItem.id}`)
          .expect(200)
          .expect(({ body }) => {
            expect(body).to.be.deep.equal(todoItem);
          }));
    });

    describe('and requesting todo item by unknown id', () => {
      it('GET /api/todo/:id should return code 404', () =>
        request(app)
          .get('/api/todo/59da7acf579f301db01174c0')
          .expect(404));
    });

    describe('and updating todo item by known id', () => {
      it('PUT /api/todo/:id should return code 404', () =>
        request(app)
          .put(`/api/todo/${todoItem.id}`)
          .send({ done: true })
          .expect(200)
          .expect(({ body }) => {
            expect(body).to.be.deep.equal({
              id: todoItem.id,
              name: todoItem.name,
              done: true,
            });
          }));
    });

    describe('and deleting todo item by known id', () => {
      before(() =>
        request(app)
          .delete(`/api/todo/${todoItem.id}`)
          .expect(200)
          .expect(({ body }) => {
            expect(body.id).to.be.deep.equal(todoItem.id);
          }));

      describe('and requesting todo item by known id', () => {
        it('GET /api/todo should return expected item', () =>
          request(app)
            .get('/api/todo')
            .expect(200)
            .expect(({ body }) => {
              expect(body).to.be.an('array');
              expect(body).to.be.empty;
            }));

        it('GET /api/todo/:id should return code 404', () =>
          request(app)
            .get(`/api/todo/${todoItem.id}`)
            .expect(404));
      });
    });
  });

  describe('when creating two todo items', () => {
    before(() =>
      request(app)
        .post('/api/todo')
        .send({ name: 'hello' })
        .expect(200));

    before(() =>
      request(app)
        .post('/api/todo')
        .send({ name: 'hello' })
        .expect(200));

    it('GET /api/todo should return two items', () =>
      request(app)
        .get('/api/todo')
        .expect(200)
        .expect(({ body }) => {
          expect(body).to.be.an('array');
          expect(body).to.have.length(2);
        }));
  });
});
