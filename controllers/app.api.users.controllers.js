const { fetchUsers, fetchUserById } = require("../models/app.api.users.models");
const checkExists = require("../utils/check-exists");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserById = (req, res, next) => {
  const { username } = req.params;

  Promise.all([
    fetchUserById(username),
    checkExists("users", "username", username),
  ])
    .then(([user]) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
