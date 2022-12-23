const {
  createUser,
  deleteUser,
  checkIfValidUserId,
  findAllUsers,
  isValidUser,
  findUserById,
} = require("./userQuery");
const {
  createPost,
  findPostByUser,
  findPostByPostId,
  deletePostByPostId,
} = require("./postQuery");
const {
  createBirthChart,
  findBirthChartByUser,
  findBirthChartById,
  deleteBirthChart,
} = require("./birthChartQuery");
const {
  addFriend,
  removeFriendFromList,
  grabAllUserFriends,
} = require("./friendQuery");

module.exports = {
  createUser,
  deleteUser,
  findAllUsers,
  isValidUser,
  findUserById,
  createPost,
  findPostByUser,
  findPostByPostId,
  deletePostByPostId,
  createBirthChart,
  findBirthChartByUser,
  findBirthChartById,
  deleteBirthChart,
  checkIfValidUserId,
  addFriend,
  removeFriendFromList,
  grabAllUserFriends,
};
