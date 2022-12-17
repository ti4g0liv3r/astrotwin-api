const User = require("../models/User");
const { passwordEncrypt, getZodiac } = require("../utils");
const { save, find } = require("./basicQuery");

const createUser = async (name, email, birthdate, password) => {
  const passwordHash = await passwordEncrypt(password, 12);

  const user = new User({
    name,
    email,
    birthdate,
    password: passwordHash,
    zodiacSign: getZodiac(birthdate),
  });

  await save(user);
  return user;
};

const checkIfValidUserId = async (id) => {
  const isValidFriendUser = await find(User, { _id: id });

  return isValidFriendUser;
};

const deleteUser = async (id) => {
  try {
    const user = await User.deleteOne({ _id: id });
    return user;
  } catch (error) {
    console.log("User not found");
  }
};

module.exports = { createUser, deleteUser, checkIfValidUserId };
