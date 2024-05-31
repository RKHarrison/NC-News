exports.handleGeneric404Errors =
  ("*",
  (req, res) => {
    res.status(404).send({ msg: "Route Not Found" });
  });

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "42P18") {
    res
      .status(400)
      .send({
        msg: `Bad ${req.method} Request: could not determine parameter placeholder`,
      });
  } 
  else if (err.code === "2201X") {
    res
      .status(400)
      .send({
        msg: `Bad ${req.method} Request: offset must be a positive integer`,
      });
  } 
  else if (err.code === "2201W") {
    res
      .status(400)
      .send({
        msg: `Bad ${req.method} Request: limit must be a positive integer`,
      });
  } else if (err.code === "42P01") {
    res.status(400).send({ msg: `Bad ${req.method} Request` });
  } else if (err.code === "23502" || err.code === "23503") {
    res.status(400).send({ msg: `Bad ${req.method} Request` });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: `Bad ${req.method} Request` });
  } else if (err.code) {
    console.log(err.code);
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
