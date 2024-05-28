exports.handleGeneric404Errors = ('*', (req, res) => {
  res.status(404).send({msg: "Route Not Found"})
})

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
