const User = require("../User");
const { passwordEncrypt, getZodiac } = require("../../utils");

const createUser = async (name, email, birthdate, password) => {
  const passwordHash = await passwordEncrypt(password, 12);
  console.log(birthdate);

  const user = new User({
    name,
    email,
    birthdate,
    password: passwordHash,
    zodiacSign: getZodiac(birthdate),
  });

  try {
    await user.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = createUser;
