exports.handleGeneric404Errors = ('*', (req, res) => {
  res.status(404).send({msg: "Route Not Found"})
})

exports.handlePsqlErrors = (err, req,res,next) => {
  console.log(err);
  if (err.code) console.log(err);
  if (err.msg)  console.log(err);
}

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
