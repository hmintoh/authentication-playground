const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const User = require("../model/user");
const { secret } = require("../../config/jwt");

const cookieExtractor = function(req) {
  let token = null;
  if (req && req.cookies) token = req.cookies["jwt"];
  return token;
};

const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: secret
};

const saveUserInRequest = async (jwt_payload, done) => {
  try {
    const user = await User.findOne({ _id: jwt_payload.userid });
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, false);
  }
};

const jwtStrategy = new JWTStrategy(jwtOptions, saveUserInRequest);
passport.use(jwtStrategy);

module.exports = passport;
