const User = require("../models/User");

const findUser = async (id) => {
  try {
    const user = await User.findById(id, "-password");
    return user;
  } catch (error) {
    console.log("User not found");
  }
};

module.exports = findUser;
