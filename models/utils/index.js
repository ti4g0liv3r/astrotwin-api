const createUser = require("./createUser");
const createPost = require("./createPost");
const createBirthChart = require("./createBirthChart");
const { addFriend, removeFriendFromList } = require("./addFriend");

module.exports = {
  createUser,
  createPost,
  createBirthChart,
  addFriend,
  removeFriendFromList,
};
