const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");

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

const User = mongoose.model("User", userSchema);
module.exports = User;
