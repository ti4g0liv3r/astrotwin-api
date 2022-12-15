const Post = require("../models/Posts");

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

module.exports = { findPostByUser, findPostByPostId, deletePostByPostId };
