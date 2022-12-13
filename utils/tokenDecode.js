const jwt_decoder = require("jwt-decode");

const jwtDecoder = (token) => {
  const decoded = jwt_decoder(token.split(" ")[1]);
  return decoded;
};

module.exports = jwtDecoder;
