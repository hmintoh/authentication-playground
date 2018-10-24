const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    index: true
  },
  email: {
    type: String,
    index: true
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
