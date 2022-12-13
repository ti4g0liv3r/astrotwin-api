const jwt = require("jsonwebtoken");
const config = require("../jwt/config.json");

const checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Not autorized" });
  }

  try {
    const refreshSecret = process.env.REFRESH_SECRET;

    jwt.verify(token, refreshSecret, { expiresIn: config.refreshTokenLife });

    next();
  } catch (error) {
    return res.status(400).json({ msg: "Invalid token" });
  }
};

module.exports = { checkToken };
