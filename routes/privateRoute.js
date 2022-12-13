const express = require("express");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../jwt/config.json");
const privateRoute = express.Router();

const { checkToken } = require("../utils/checkToken");
const { passwordCompare } = require("../utils/passwordEncrypt");

const User = require("../models/User");
const { createUser, createPost } = require("../models/utils/index");
const findUser = require("../queries");

//Create a new user route

privateRoute.post("/auth/register", async (req, res) => {
  console.log("Registration called");
  const { name, email, birthdate, password, confirmPasspord } = req.body;

  if (!name) {
    return res.status(422).json({ msg: "Missing name field" });
  }
  if (!email) {
    return res.status(422).json({ msg: "Missing email field" });
  }

  if (!password) {
    return res.status(422).json({ msg: "Missing password field" });
  }

  if (!confirmPasspord) {
    return res.status(422).json({ msg: "Missing password confirmation field" });
  }

  if (password !== confirmPasspord) {
    return res
      .status(422)
      .json({ msg: "Password and password confirmation must be the same" });
  }

  //Check if user exists

  const userExists = await User.findOne({ email: email });

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

privateRoute.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  //Users validation
  if (!email) {
    return res.status(422).json({ msg: "Email is a required field" });
  }
  if (!password) {
    return res.status(422).json({ msg: "Password is a required field" });
  }

  //Check if user exists

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ msg: "User does not exist" });
  }

  const checkPassword = await passwordCompare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Password is incorrect" });
  }

  //If valitation passes, return a message and the JWT token
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

    const response = {
      msg: "Logged in",
      token: token,
      refreshToken: refreshToken,
    };

    tokenList[refreshToken] = response;
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Oops! something went wrong", token });
  }
});

privateRoute.get("/auth/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  //check if user exists

  const user = await findUser(id);

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  res.status(200).json({ user });
});

privateRoute.post("/auth/user/:id/post", checkToken, async (req, res) => {
  const id = req.params.id;
  const post = req.body.post;

  const usertoken = req.headers.authorization;
  const token = usertoken.split(" ");
  const decoded = jwt.verify(token[1], "secret-key");
  console.log(decoded);

  //const newPost = createPost(post, id);

  if (!newPost) {
    return res.status(404).json({ msg: "Could post the message" });
  }

  res.status(200).json({ msg: "Posted correctly" });
});

module.exports = privateRoute;
