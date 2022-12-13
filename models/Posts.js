const mongoose = require("mongoose");

const Post = mongoose.model("Post", {
  date: Date,
  post: String,
  user: String,
});

module.exports = Post;
