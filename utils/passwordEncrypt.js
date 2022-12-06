const bcrypt = require("bcrypt");

const passwordEncrypt = async (text, size) => {
  try {
    const salt = await bcrypt.genSalt(size);

    const hash = await bcrypt.hash(text, salt);

    return hash;
  } catch (error) {
    console.log(error);
  }
};

const passwordCompare = async (password, userPassword) => {
  try {
    const passwordChecked = await bcrypt.compare(password, userPassword);
    return passwordChecked;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { passwordEncrypt, passwordCompare };
