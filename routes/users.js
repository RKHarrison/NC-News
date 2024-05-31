const {
  usersControllers: { getUsers, getUserById },
} = require("../controllers/");

const usersRouter = require("express").Router();

usersRouter.get('/', getUsers);
usersRouter.get("/:username", getUserById)

module.exports = usersRouter;
