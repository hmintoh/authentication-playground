const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { secret } = require("../../config/jwt");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "is required"],
    index: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "is required"],
    index: true
  },
  passwordHash: {
    type: String
  },
  passwordSalt: {
    type: String
  }
});

//setPassword method
userSchema.methods.setPassword = function(password) {
  this.passwordSalt = generateSalt();
  this.passwordHash = hashPassword(password, this.passwordSalt);
};

function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password, salt) {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 512, "sha512")
    .toString("hex");
}

userSchema.plugin(uniqueValidator, {
  message: "should be unique"
});

//validPassword method, checks input password with hash val in db
//returns a bool
userSchema.methods.validPassword = function(password) {
  return this.passwordHash === hashPassword(password, this.passwordSalt);
};

//generate JWT token
userSchema.methods.generateJWT = function() {
  //constructor
  const today = new Date();
  //set exp to 60 days from today in seconds
  const exp = new Date().setDate(today.getDate() + 60) / 1000;
  return jwt.sign(
    {
      userid: this._id,
      username: this.username,
      exp: exp
    },
    secret
  );
};

userSchema.methods.verifyJWT = function(token) {
  try {
    jwt.verify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
