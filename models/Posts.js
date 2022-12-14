const mongoose = require("mongoose");

const Post = mongoose.model("Post", {
  date: Date,
  post: String,
  userId: String,
});

module.exports = Post;
