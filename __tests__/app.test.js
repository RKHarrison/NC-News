const request = require("supertest");
const app = require("../api/app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endpointsJsonFile = require("../endpoints.json");

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

describe("GET /api", () => {
  it("200: responds with an object containing each available endpoint and description", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: endpoints }) => {
        const expectedResults = endpointsJsonFile;
        expect(endpoints).toEqual(expectedResults);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("200: responds with an object matching the requested id, with correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body}) => {
        const article = body.article
        const expectedResult =
          endpointsJsonFile["GET /api/articles/:article_id"].exampleResponse
            .article;
        expect(article).toMatchObject(expectedResult);
      });
  });
  it("404: responds with 'Not Found' when given valid but non-existing id", () => {
    return request(app)
      .get("/api/articles/987654321")
      .expect(404)
      .then(({ body }) => {
        const errorMsg = body.msg;
        expect(errorMsg).toBe("Not Found");
      });
  });
  it("400: responds with 'Bad Request' when failing schema validation", () => {
    return request(app)
      .get("/api/articles/notAValidId")
      .expect(400)
      .then(({ body }) => {
        const errorMsg = body.msg;
        expect(errorMsg).toBe("Bad Request");
      });
  });
});

describe('GET /api/articles', () => {
  it('200: responds with array of article objects sorted descending by date created, with correct properties', () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body}) =>{
      const articles = body.articles
      expect(articles).toHaveLength(13)
      expect(articles).toBeSortedBy('created_at', {descending:true})
      articles.forEach(article => {
        expect(article).not.toHaveProperty('body')
      })
    })
  });
  
});