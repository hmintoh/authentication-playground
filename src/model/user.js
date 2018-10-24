const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");

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
  }
});

userSchema.plugin(uniqueValidator, { message: "should be unique" });

const User = mongoose.model("User", userSchema);
module.exports = User;
