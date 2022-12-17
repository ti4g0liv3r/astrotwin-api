const {
  createUser,
  deleteUser,
  checkIfValidUserId,
  findAllUsers,
} = require("./userQuery");
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
  findAllUsers,
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
