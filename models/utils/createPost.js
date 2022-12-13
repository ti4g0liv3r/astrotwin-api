const Post = require("../Posts");

const createPost = async (post, userID) => {
  const date = new Date();
  const newPost = new Post({
    date,
    post,
    user: userID,
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
