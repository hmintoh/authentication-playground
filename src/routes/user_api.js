const express = require("express");
const router = express.Router();
const User = require("../model/user");

const asyncWrap = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(error => next(error));
};

// new user registration
router.post("/signup", asyncWrap(registerNewUser));

async function registerNewUser(req, res) {
  const user = new User({
    username: req.body.user.username,
    email: req.body.user.email
  });
  user.setPassword(req.body.user.password);
  await user.save();

  res
    .status(200)
    .json({ user: { username: user.username, email: user.email } });
}

module.exports = router;
