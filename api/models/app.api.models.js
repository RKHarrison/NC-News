const fs = require("fs/promises");

exports.fetchEndpoints = () => {
    const pathToEndpointsJson = `${__dirname}/../../endpoints.json`
  
    return fs.readFile(pathToEndpointsJson, "utf-8").then((data) => {
      const parsedData = JSON.parse(data)
      const endpoints = parsedData
      return endpoints
    });
  };