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
            expect(article).toMatchObject({
              article_id : 1,
              author : "butter_bridge",
              title : "Living in the shadow of a great man",
              body : "I find this existence challenging",
              created_at : "2020-07-09T20:11:00.000Z",
              votes : 100,
              article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            })
        })
    });
    it("404: responds with 'Not Found' when given valid but non-existing id", () => {
      return request(app)
      .get('/api/articles/987654321')
      .expect(404)
      .then(({body}) =>{
        const errorMsg = body.msg
        expect(errorMsg).toBe("Resource Not Found")
      })
    })
    it("400: responds with 'Bad Request' when failing schema validation", () => {
      return request(app)
      .get('/api/articles/notAValidId')
      .expect(400)
      .then(({body}) =>{
        const errorMsg = body.msg
        expect(errorMsg).toBe("Bad Request")
      })
    })
});
