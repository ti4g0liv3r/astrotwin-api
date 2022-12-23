const express = require("express");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../jwt/config.json");
const router = express.Router();

const { jwtDecoder, checkToken, passwordCompare } = require("../utils");

const {
  createUser,
  deleteUser,
  findAllUsers,
  isValidUser,
  findUserById,
} = require("../queries");

///////////////////////////////////////////////////////
//
// -*-*- USER MANAGEMENT ROUTER -*-*-
//
// * PENDING TASKS HERE
//
// - ADD YUP TO VALIDATIONS
//
///////////////////////////////////////////////////////

router.post("/register", async (req, res) => {
  const { name, email, birthdate, password, confirmPassword } = req.body;

  if (!name) {
    return res.status(422).json({ msg: "Missing name field" });
  }
  if (!email) {
    return res.status(422).json({ msg: "Missing email field" });
  }

  if (!password) {
    return res.status(422).json({ msg: "Missing password field" });
  }

  if (!confirmPassword) {
    return res.status(422).json({ msg: "Missing password confirmation field" });
  }

  if (password !== confirmPassword) {
    return res
      .status(422)
      .json({ msg: "Password and password confirmation must be the same" });
  }

  const userExists = await isValidUser({ email: email });

  if (userExists) {
    return res.status(422).json({ msg: "Please, use another email" });
  }
  const user = await createUser(name, email, birthdate, password);

  if (user) {
    return res.status(201).json({ msg: "User created" });
  } else {
    return res.status(500).json({ msg: "Oops! something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({ msg: "Email is a required field" });
  }
  if (!password) {
    return res.status(422).json({ msg: "Password is a required field" });
  }

  const user = await isValidUser({ email: email });

  if (!user) {
    return res.status(404).json({ msg: "User does not exist" });
  }

  const checkPassword = await passwordCompare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Password is incorrect" });
  }

  try {
    const secret = process.env.SECRET;
    const refreshSecret = process.env.REFRESH_SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );
    const refreshToken = jwt.sign(
      {
        id: user._id,
        expiresIn: jwtConfig.refreshTokenLife,
      },
      refreshSecret
    );

    return res.status(200).json({
      msg: "User connected",
      user: {
        name: user.name,
        email: user.email,
        birthdate: user.birthdate,
        zodiacSign: user.zodiacSign,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Oops! something went wrong", token });
  }
});

router.get("/profile/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  const user = await findUserById({ id: id, option: { password: 0 } });

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  return res.status(200).json({ user });
});

router.delete("/profile/:id", checkToken, async (req, res) => {
  const id = req.params.id;
  const decodedToken = jwtDecoder(req.headers.authorization);
  const tokenUserId = decodedToken.id;

  const user = await findUserById({ id: id, option: { password: 0 } });

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  if (id !== tokenUserId) {
    return res.status(403).json({ msg: "Permision denied" });
  }

  try {
    await deleteUser(id);
    return res.status(200).json({ msg: "User deleted" });
  } catch (error) {
    return res.status(500).json({ msg: "Oops! something went wrong" });
  }
});

router.get("/profiles", checkToken, async (req, res) => {
  const query = { dbQuery: {}, options: { password: 0 } };
  const users = await findAllUsers(query);

  if (!users) {
    return res.status(404).json({ msg: "Users not found" });
  }

  return res.status(200).json({ users });
});

module.exports = router;
