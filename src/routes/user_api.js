const express = require("express");
const router = express.Router();
const User = require("../model/user");
// const jwt_validation = require("../middleware/jwt_middleware");
const passport = require("passport");

const asyncWrap = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(error => next(error));
};

// new user registration
router.post("/signup", asyncWrap(registerNewUser));

// user login
router.post("/login", asyncWrap(userLogin));

//change password
router.put(
  "/change_password",
  passport.authenticate("jwt", { session: false }),
  // jwt_validation.required,
  asyncWrap(changePassword)
);

// user logout
router.post("/logout", asyncWrap(logout));

//async functions
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
  // return res.json({
  //   user: { username: user.username, email: user.email, token: token }
  // });
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: true
  });
  return res.json({
    user: { username: user.username, email: user.email }
  });
}

async function changePassword(req, res) {
  // const userId = req.user.userid;
  // const user = await User.findById(userId);

  //with passport, user is alr saved in req so no need to lookup
  const user = req.user;

  const newUserProfile = req.body.user;
  if (newUserProfile.password) {
    user.setPassword(newUserProfile.password);
  }

  await user.save();
  return res.json({ status: "done" });
}

async function logout(req, res) {
  res.clearCookie("jwt");
  res.json({ status: "done" });
}

module.exports = router;
