const User = require("../models/User");

const checkIfValidUserId = async (id) => {
  const isValidFriendUser = await User.find({
    _id: id,
  })
    .then((res) => res)
    .catch((error) => {
      console.log(error);
      return false;
    });

  return isValidFriendUser;
};

const findUser = async (id) => {
  try {
    const user = await User.findById(id, "-password");
    return user;
  } catch (error) {
    console.log("User not found");
  }
};

const deleteUser = async (id) => {
  try {
    const user = await User.deleteOne({ _id: id });
    return user;
  } catch (error) {
    console.log("User not found");
  }
};

module.exports = { findUser, deleteUser, checkIfValidUserId };
