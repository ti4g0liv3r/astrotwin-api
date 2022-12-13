const jwt = require("jsonwebtoken");
const jwt_decoder = require("jwt-decode");
const config = require("../jwt/config.json");

const checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Not autorized" });
  }

  try {
    const secret = process.env.SECRET;
    const refreshSecret = process.env.REFRESH_SECRET;

    const decoded = jwt_decoder(token);

    if (!decoded.expiresIn) {
      jwt.verify(token, secret);
    } else {
      jwt.verify(token, refreshSecret, { expiresIn: config.refreshTokenLife });
    }

    next();
  } catch (error) {
    return res.status(400).json({ msg: "Invalid token" });
  }
};

module.exports = checkToken;
