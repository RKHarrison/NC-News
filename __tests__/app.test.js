const request = require("supertest");
const app = require("../api/app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed");

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
