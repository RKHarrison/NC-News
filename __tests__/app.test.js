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
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          article_id: 1,
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("200: responds with an article matching article_id with a correct comment_count colum", () => {
    return request(app)
      .get("/api/articles/1?count=comments")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          comment_count: 11,
          article_id: 1,
        });
      });
  });
  it("200: respond with a 0 comment_count for article with no comments", () => {
    return request(app)
      .get("/api/articles/4?count=comments")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          comment_count: 0,
          article_id: 4,
        });
      });
  });
  it("404: responds with 'Not Found' when given valid but non-existing id", () => {
    return request(app)
      .get("/api/articles/987654321")
      .expect(404)
      .then(({ body }) => {
        const errorMsg = body.msg;
        expect(errorMsg).toBe("Resource Not Found");
      });
  });
  it("400: responds with 'Bad Request' when failing schema validation", () => {
    return request(app)
      .get("/api/articles/notAValidId")
      .expect(400)
      .then(({ body }) => {
        const errorMsg = body.msg;
        expect(errorMsg).toBe("Bad GET Request");
      });
  });
});

describe("GET /api/articles", () => {
  it("200: responds with array of article objects sorted descending by date created, with correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("200: responds with an array of comments for the given article id, sorted by most recent, with the correct properties ", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const commentsForArticleId = body.commentsForArticleId;
        expect(commentsForArticleId).toHaveLength(11);
        expect(commentsForArticleId).toBeSortedBy("created_at", {
          descending: true,
        });
        commentsForArticleId.forEach((comment) => {
          expect(comment).toMatchObject({
            article_id: 1,
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(String),
            comment_id: expect.any(Number),
          });
        });
      });
  });
  it("200: responds with empty array of comments given existing article id with no comments linked to it ", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const commentsForArticleId = body.commentsForArticleId;
        expect(commentsForArticleId).toHaveLength(0);
        expect(commentsForArticleId).toBeInstanceOf(Array);
      });
  });
  it("404: responds 'Not Found' when given valid but non-existing article id", () => {
    return request(app)
      .get("/api/articles/987654321/comments")
      .expect(404)
      .then(({ body }) => {
        const errorMsg = body.msg;
        expect(errorMsg).toBe("Resource Not Found");
      });
  });
  it("400: responds with 'Bad Request' when failing schema validation", () => {
    return request(app)
      .get("/api/articles/notAValidId/comments")
      .expect(400)
      .then(({ body }) => {
        const errorMsg = body.msg;
        expect(errorMsg).toBe("Bad GET Request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("201: adds new comment for article by article id, and responds with posted comment object", () => {
    const newComment = { username: "butter_bridge", body: "very nice" };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        postedComment = body.postedComment;
        expect(postedComment).toMatchObject({
          article_id: 3,
          comment_id: expect.any(Number),
          body: "very nice",
          author: "butter_bridge",
        });
      });
  });
  it("400: responds 'Bad Post Request' when newComment object has malformed body/missing fields", () => {
    const newComment = { username: "butter_bridge" };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const errorMsg = body.msg;
        expect(errorMsg).toBe("Bad POST Request");
      });
  });
  it("400: responds 'Bad Post Request' when newComment object failing input schema validation ", () => {
    const newComment = { username: "butter_bridge", body: null };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const errorMsg = body.msg;
        expect(errorMsg).toBe("Bad POST Request");
      });
  });
  it("404: responds 'Not Found' when given valid but non-existing author", () => {
    const newComment = { username: "NOTFOUND", body: "very nice" };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const errorMsg = body.msg;
        expect(errorMsg).toBe("Resource Not Found");
      });
  });
  it("404: responds 'Not Found' when given valid but non-existing article id", () => {
    const newComment = { username: "butter_bridge", body: "very nice" };
    return request(app)
      .post("/api/articles/987654321/comments")
      .expect(404)
      .send(newComment)
      .then(({ body }) => {
        const errorMsg = body.msg;
        expect(errorMsg).toBe("Resource Not Found");
      });
  });
  it("400: responds with 'Bad Request' when failing article id schema validation", () => {
    return request(app)
      .get("/api/articles/notAValidId/comments")
      .expect(400)
      .then(({ body }) => {
        const errorMsg = body.msg;
        expect(errorMsg).toBe("Bad GET Request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("200: updates article value by postive integer and responds with updated article object", () => {
    const incomingVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(incomingVotes)
      .expect(200)
      .then(({ body }) => {
        const patchedArticle = body.patchedArticle;
        expect(patchedArticle).toMatchObject({
          article_id: 1,
          votes: 101,
        });
      });
  });
  it("200: updates article value by negative integer and responds with updated article object", () => {
    const incrementVotes = { inc_votes: -100 };
    return request(app)
      .patch("/api/articles/1")
      .send(incrementVotes)
      .expect(200)
      .then(({ body }) => {
        const patchedArticle = body.patchedArticle;
        expect(patchedArticle).toMatchObject({
          article_id: 1,
          votes: 0,
        });
      });
  });
  it("400: responds 'Bad Patch Request' when patch object has malformed body/missing fields", () => {
    const incrementVotes = {};
    return request(app)
      .patch("/api/articles/1")
      .send(incrementVotes)
      .expect(400)
      .then(({ body }) => {
        const errorMsg = body.msg;
        expect(errorMsg).toBe("Bad PATCH Request");
      });
  });
  it("400: responds 'Bad Patch Request' when patch object failing input schema validation", () => {
    const incrementVotes = { inc_votes: "INVALID_INPUT" };
    return request(app)
      .patch("/api/articles/1")
      .send(incrementVotes)
      .expect(400)
      .then(({ body }) => {
        const errorMsg = body.msg;
        expect(errorMsg).toBe("Bad PATCH Request");
      });
  });
  it("404: responds 'Not Found' when given valid but non-existing article id", () => {
    const incrementVotes = { inc_votes: -100 };
    return request(app)
      .patch("/api/articles/987654321")
      .send(incrementVotes)
      .expect(404)
      .then(({ body }) => {
        const errorMsg = body.msg;
        expect(errorMsg).toBe("Resource Not Found");
      });
  });
  it("400: responds with 'Bad Request' when failing article id schema validation", () => {
    const incrementVotes = { inc_votes: -100 };
    return request(app)
      .patch("/api/articles/NOTAVALIDID")
      .send(incrementVotes)
      .expect(400)
      .then(({ body }) => {
        const errorMsg = body.msg;
        expect(errorMsg).toBe("Bad PATCH Request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("204 deletes the given comment by comment_id and responds with no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  it("404: responds Not Found when given valid but non-exitsting comment", () => {
    return request(app)
      .delete("/api/comments/987654321")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource Not Found");
      });
  });
  it("400: Returns Bad Request when given invalid comment id", () => {
    return request(app)
      .delete("/api/comments/NOT_AN_ID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad DELETE Request");
      });
  });
});

describe("GET /api/users", () => {
  it("200: responds with array of all users with correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET api/articles?filter_by=:filterTerm", () => {
  it("200: responds with filtered articles", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const filteredArticles = body.articles;
        expect(filteredArticles).toHaveLength(1);
        expect(filteredArticles[0]).toMatchObject({
          article_id: 5,
          topic: "cats",
        });
      });
  });
  it("200: responds with filtered articles by a different filter term", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const filteredArticles = body.articles;
        expect(filteredArticles).toHaveLength(12);
        filteredArticles.forEach((article) => {
          expect(article).toHaveProperty("topic", "mitch");
        });
      });
  });
  it("200: responds with default 'GET /api/articles' behvaiour if unrecognised query column", () => {
    return request(app)
      .get("/api/articles?UNRECOGNISED_QUERY_COLUMN")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  it("200: responds with empty array if no matching data for valid query", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const filteredArticles = body.articles;
        expect(filteredArticles).toHaveLength(0);
        expect(filteredArticles).toEqual([]);
      });
  });
  it("404: responds Not Found array if no matching topic exists", () => {
    return request(app)
      .get("/api/articles?topic=NONEXISTENT")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource Not Found");
      });
  });
});
