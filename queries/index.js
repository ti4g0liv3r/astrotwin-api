const findUser = require("./userQuery");
const {
  findPostByUser,
  findPostByPostId,
  deletePostByPostId,
} = require("./postQuery");

module.exports = {
  findUser,
  findPostByUser,
  findPostByPostId,
  deletePostByPostId,
};
