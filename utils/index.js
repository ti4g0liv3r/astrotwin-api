const checkToken = require("./checkToken");
const { passwordEncrypt, passwordCompare } = require("./passwordEncrypt");
const getZodiac = require("./findZodiac");
const jwtDecoder = require("./tokenDecode");
const calculateBirthChart = require("./calculateBirthChart");

module.exports = {
  checkToken,
  passwordEncrypt,
  passwordCompare,
  getZodiac,
  jwtDecoder,
  calculateBirthChart,
};
