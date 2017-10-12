const request = require('supertest');

const app = require('../server');

describe('/_health', () => {
  describe('GET /_health', () => {
    it('should return code 200', () =>
      request(app)
        .get('/_health')
        .expect(200));
  });
});
