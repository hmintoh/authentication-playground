require("dotenv").config();

const getJWTSecret = () => {
  //get secret from .env doc
  const secret = process.env.JWT_SIGNING_SECRET;
  if (!secret) {
    throw new Error("no secret found");
  }
  return secret;
};

module.exports = {
  secret: getJWTSecret()
};
