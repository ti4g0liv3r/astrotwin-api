const Post = require("../models/Posts");
const { save, find, deleteOne } = require("./basicQuery");

const createPost = async (post, userId) => {
  const date = new Date();
  const newPost = new Post({
    date,
    post,
    userId,
  });

  await save(newPost);

  return newPost;
};

const findPostByUser = async (userId) => {
  const post = await find(Post, { userId: userId });
  return post;
};

const findPostByPostId = async (postID) => {
  const post = await find(Post, { _id: postID });
  return post;
};

const deletePostByPostId = async (postID) => {
  const post = await deleteOne(Post, { _id: postID });
  return post;
};

module.exports = {
  createPost,
  findPostByUser,
  findPostByPostId,
  deletePostByPostId,
};
