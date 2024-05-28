const request = require("supertest");
const app = require("../api/app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed");
const endpointsJsonFile = require('../endpoints.json')

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  it("200: responds with an array of objects with correct properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
  it("404: responds 'not a route' when receives a request to an undefined endpoint ", () => {
    return request(app)
      .get("/api/UNDEFINED")
      .expect(404)
      .then(({ body }) => {
        const errorMsg = body.msg;
        expect(errorMsg).toBe("Route Not Found");
      });
  });
});

describe('GET /api', () => {
    it('200: responds with an object containing each available endpoint and description', () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body: endpoints}) => {
            const expectedResults = endpointsJsonFile
            expect(endpoints).toEqual(expectedResults)
        })
    });
    
});

describe('GET /api/articles/:article_id', () => {
    it('200: responds with an object matching the requested id, with correct properties', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body:article}) => {
            const expectedResult = endpointsJsonFile["GET /api/articles/:article_id"].exampleResponse.article
            expect(article).toMatchObject(expectedResult)
        })
    });
});
