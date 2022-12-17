const Post = require("../models/Posts");

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

const findPostByUser = async (userId) => {
  try {
    const post = await Post.find({ userId: userId });
    return post;
  } catch (error) {
    console.log("No posts found for that user");
  }
};

const findPostByPostId = async (postID) => {
  try {
    const post = await Post.find({ _id: postID });
    return post;
  } catch (error) {
    console.log("No posts found with that post id");
  }
};

const deletePostByPostId = async (postID) => {
  console.log(`Post ${postID} requested to be deleted`);
  try {
    const post = await Post.deleteOne({ _id: postID });
    return post;
  } catch (error) {
    console.log("No posts found for that post id");
  }
};

module.exports = {
  createPost,
  findPostByUser,
  findPostByPostId,
  deletePostByPostId,
};
