const { findUser, deleteUser } = require("./userQuery");
const {
  findPostByUser,
  findPostByPostId,
  deletePostByPostId,
} = require("./postQuery");
const { findBirthChart, deleteBirthChart } = require("./birthChartQuery");

module.exports = {
  findUser,
  deleteUser,
  findPostByUser,
  findPostByPostId,
  deletePostByPostId,
  findBirthChart,
  deleteBirthChart,
};
