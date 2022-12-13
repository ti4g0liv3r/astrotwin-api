const mongoose = require("mongoose");

const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
  birthdate: String,
  zodiacSign: String,
});

module.exports = User;
