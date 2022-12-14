const Post = require("../Posts");

const createPost = async (post, userId) => {
  const date = new Date();
  const newPost = new Post({
    date,
    post,
    userId,
  });

  try {
    await newPost.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = createPost;
