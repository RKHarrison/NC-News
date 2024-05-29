const checkExists = require("../api/utils/check-exists");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => {
    return seed(data);
  });
  afterAll(() => {
    return db.end();
  });

  
describe("checkExists", () => {
  it("outputs undefined when given table, column and id that represent existing resource", () => {
    const table = "articles";
    const column = "article_id";
    const value = 1;

    return checkExists(table, column, value).then((result) => {
      expect(result).toBeUndefined();
    });
  });
  it("outputs undefined when given different table, column and id that represent existing resource", () => {
    const table = "comments";
    const column = "comment_id";
    const value = 2;

    return checkExists(table, column, value).then((result) => {
      expect(result).toBeUndefined();
    });
  });
  it("404: returns not found when given a valid but non-existing value", () => {
    const table = "articles";
    const column = "article_id";
    const value = 987654321;

    return checkExists(table, column, value).catch((err) => {
      expect(err).toMatchObject({ status: 404, msg: "Resource Not Found" });
    });
  });
  it("22P02: psql error code when given invalid value", () => {
    const table = "articles";
    const column = "article_id";
    const value = "INVALIDVALUE";
    return checkExists(table, column, value).catch((err) => {
      expect(err.code).toBe("22P02");
    });
  });
});
