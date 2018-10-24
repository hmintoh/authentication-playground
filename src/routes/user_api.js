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

// user login
router.post("/login", asyncWrap(userLogin));

async function userLogin(req, res) {
  const email = req.body.user.email;
  const password = req.body.user.password;

  const user = await User.findOne({ email: email });
  if (!user || !user.validPassword(password)) {
    return res
      .status(401)
      .json({ error: { message: "email or password is invalid" } });
  }
  //generate JWT and return token as JSON response
  const token = user.generateJWT();
  return res.json({
    user: { username: user.username, email: user.email, token: token }
  });
}

module.exports = router;
