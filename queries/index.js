const { createUser, deleteUser, checkIfValidUserId } = require("./userQuery");
const {
  createPost,
  findPostByUser,
  findPostByPostId,
  deletePostByPostId,
} = require("./postQuery");
const {
  createBirthChart,
  findBirthChart,
  deleteBirthChart,
} = require("./birthChartQuery");
const { addFriend, removeFriendFromList } = require("./friendQuery");

module.exports = {
  createUser,
  deleteUser,
  createPost,
  findPostByUser,
  findPostByPostId,
  deletePostByPostId,
  createBirthChart,
  findBirthChart,
  deleteBirthChart,
  checkIfValidUserId,
  addFriend,
  removeFriendFromList,
};
