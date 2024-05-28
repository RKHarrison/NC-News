const db = require("../../db/connection");
const fs = require("fs/promises");

exports.fetchTopics = () => {
  const sqlQuery = "SELECT * FROM topics";
  return db.query(sqlQuery).then((topics) => topics.rows);
};

exports.fetchEndpoints = () => {
  const pathToEndpointsJson = `${__dirname}/../../endpoints.json`

  return fs.readFile(pathToEndpointsJson, "utf-8").then((data) => {
    const parsedData = JSON.parse(data)
    const endpoints = parsedData
    return endpoints
  });
};
