const express = require("express");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../jwt/config.json");
const router = express.Router();

const {
  jwtDecoder,
  checkToken,
  passwordCompare,
  calculateBirthChart,
} = require("../utils");
const { createUser, createPost } = require("../models/utils/index");
const {
  findUser,
  deleteUser,
  findPostByUser,
  findPostByPostId,
  deletePostByPostId,
} = require("../queries");

const User = require("../models/User");

//CREATE A NEW USER ROUTE

router.post("/auth/register", async (req, res) => {
  const { name, email, birthdate, password, confirmPasspord } = req.body;

  // Basic params check

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

  //Check is user exists

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

// USER LOGIN ROUTE

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  //Users data validation

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

  // If valitation passes, return a message and the JWT token

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

    res.status(200).json({
      msg: "User connected",
      token,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Oops! something went wrong", token });
  }
});

//GET USER'S INFORMATION BY USER ID ROUTE

router.get("/auth/user/profile/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  //check if user exists

  const user = await findUser(id);

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  res.status(200).json({ user });
});

//DELETE USER ROUTE

router.delete("/auth/user/profile/:id", checkToken, async (req, res) => {
  const id = req.params.id;
  const decodedToken = jwtDecoder(req.headers.authorization);
  const tokenUserId = decodedToken.id;

  //check if user exists

  const user = await findUser(id);

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

// POSTS ROUTERS

// CREATE A NEW POST ROUTE

router.post("/auth/user/post", checkToken, async (req, res) => {
  const post = req.body.post;

  const decodedToken = jwtDecoder(req.headers.authorization);

  const newPost = createPost(post, decodedToken.id);

  if (!newPost) {
    return res.status(404).json({ msg: "Could post the message" });
  }

  res.status(200).json({ msg: "Posted correctly" });
});

// GET USER POSTS

router.get("/auth/user/posts", checkToken, async (req, res) => {
  const decodedToken = jwtDecoder(req.headers.authorization);
  const userId = decodedToken.id;

  const post = await findPostByUser(userId);

  if (!post) {
    return res.status(404).json({ msg: "Not posts for this user" });
  }

  res.status(200).json({ post });
});

//DELETE USER'S POST BY ID

router.delete("/auth/user/post/:postID", checkToken, async (req, res) => {
  const postID = req.params.postID;
  const decodedToken = jwtDecoder(req.headers.authorization);
  const userId = decodedToken.id;

  const post = await findPostByPostId(postID);

  if (!post) {
    return res.status(404).json({ msg: "Not posts for this user" });
  }

  if (userId !== post[0].user) {
    return res.status(403).json({ msg: "Permision denied!" });
  }

  try {
    await deletePostByPostId(postID);
    res.status(200).json({ msg: "Post deleted!" });
  } catch (error) {
    res.status(500).json({ msg: "Couldn't delete the post requested" });
  }
});

///////////////////////////////////////////////////////

router.post("/auth/user/birthchart/calculate", checkToken, async (req, res) => {
  const { date, hour, minute, latitude, longitude } = req.body;

  const birthChart = calculateBirthChart(
    date,
    hour,
    minute,
    latitude,
    longitude
  );

  //const decodedToken = jwtDecoder(req.headers.authorization);

  res.status(200).json({ msg: "Birhchart calculated correctly", birthChart });
});

module.exports = router;
