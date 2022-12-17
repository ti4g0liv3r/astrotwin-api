const User = require("../models/User");
const { passwordEncrypt, getZodiac } = require("../utils");
const { save, find, deleteOne } = require("./basicQuery");

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
  const user = await deleteOne(User, { _id: id });
  return user;
};

module.exports = { createUser, deleteUser, checkIfValidUserId };
