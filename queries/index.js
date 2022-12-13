const { findUser, deleteUser } = require("./userQuery");
const {
  findPostByUser,
  findPostByPostId,
  deletePostByPostId,
} = require("./postQuery");

module.exports = {
  findUser,
  deleteUser,
  findPostByUser,
  findPostByPostId,
  deletePostByPostId,
};
