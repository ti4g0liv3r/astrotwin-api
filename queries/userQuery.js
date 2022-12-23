const User = require("../models/User");
const { passwordEncrypt, getZodiac } = require("../utils");
const {
  save,
  find,
  findAll,
  deleteOne,
  findOne,
  findById,
} = require("./basicQuery");

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

const findAllUsers = async (query) => {
  const user = await findAll(User, query);
  return user;
};

const isValidUser = async (query) => {
  const user = await findOne(User, query);
  return user && user.length !== 0 ? user : false;
};

const findUserById = async (query) => {
  const user = await findById(User, query);
  return user && user.length !== 0 ? user : false;
};

module.exports = {
  createUser,
  deleteUser,
  checkIfValidUserId,
  findAllUsers,
  isValidUser,
  findUserById,
};
