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

const {
  createUser,
  createPost,
  createBirthChart,
  addFriend,
  removeFriendFromList,
} = require("../models/utils/index");

const {
  findUser,
  deleteUser,
  checkIfValidUserId,
  findPostByUser,
  findPostByPostId,
  deletePostByPostId,
  findBirthChart,
  deleteBirthChart,
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

    return res.status(200).json({
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

  return res.status(200).json({ user });
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

  return res.status(201).json({ msg: "Posted correctly" });
});

// GET USER POSTS

router.get("/auth/user/posts/:userId", checkToken, async (req, res) => {
  const userId = req.params.userId;

  const post = await findPostByUser(userId);

  if (!post) {
    return res.status(404).json({ msg: "Not posts found for this user" });
  }

  return res.status(200).json({ post });
});

//DELETE USER'S POST BY ID

router.delete("/auth/user/post/:postId", checkToken, async (req, res) => {
  const postId = req.params.postId;
  const decodedToken = jwtDecoder(req.headers.authorization);
  const userId = decodedToken.id;

  const post = await findPostByPostId(postId);

  if (!post) {
    return res.status(404).json({ msg: "Not posts found for this user" });
  }

  if (userId !== post[0].user) {
    return res.status(403).json({ msg: "Permision denied!" });
  }

  try {
    await deletePostByPostId(postID);
    return res.status(200).json({ msg: "Post deleted!" });
  } catch (error) {
    return res.status(500).json({ msg: "Couldn't delete the post requested" });
  }
});

///////////////////////////////////////////////////////

//BIRTHCHART CREATION

router.post("/auth/user/birthchart/calculate", checkToken, async (req, res) => {
  const { date, hour, minute, latitude, longitude } = req.body;
  const decodedToken = jwtDecoder(req.headers.authorization);
  const userId = decodedToken.id;

  const birthChart = calculateBirthChart(
    date,
    hour,
    minute,
    latitude,
    longitude,
    userId
  );

  const existingBirthchart = await findBirthChart(userId);

  if (existingBirthchart.length == 0) {
    if (birthChart) {
      try {
        await createBirthChart(birthChart);
        return res
          .status(201)
          .json({ msg: "Birhchart calculated correctly", birthChart });
      } catch (error) {
        console.log("Couldn't create birthchart");
        return res.status(500).json({ msg: "Couldn't created birthchart" });
      }
    } else {
      return res.status(500).json({ msg: "Couldn't generate birthchart" });
    }
  } else {
    return res.status(403).json({ msg: "User already has a birthchart" });
  }
});

router.get("/auth/user/birthchart/chart", checkToken, async (req, res) => {
  const decodedToken = jwtDecoder(req.headers.authorization);
  const userId = decodedToken.id;

  const birthChart = await findBirthChart(userId);

  if (birthChart.length !== 0) {
    return res.status(200).json({ birthChart });
  }

  return res.status(404).json({ msg: "No birthchart found" });
});

router.delete(
  "/auth/user/birthchart/:birthChartId",
  checkToken,
  async (req, res) => {
    const { birthChartId } = req.params;
    const decodedToken = jwtDecoder(req.headers.authorization);
    const userId = decodedToken.id;

    const birthChart = await findBirthChart(userId);

    if (birthChart.length !== 0) {
      if (userId === birthChart[0].userId) {
        try {
          await deleteBirthChart(birthChartId);
          return res.status(200).json({ msg: "Birthchart deleted" });
        } catch (error) {
          console.log("Couldn't delete birthchart", error);
          return res
            .status(500)
            .json({ msg: "Couldn't delete birthchart", error });
        }
      }
    }

    return res.status(404).json({ msg: "Birthchart not found" });
  }
);

///////////////////////////////////////////////////////

//FRIENDS MANAGEMENT SESSION

router.put("/auth/friends/:friendId", checkToken, async (req, res) => {
  const friendId = req.params.friendId;
  const decodedToken = jwtDecoder(req.headers.authorization);
  const userId = decodedToken.id;

  const isValidUser = await checkIfValidUserId(friendId);
  const friendIsNotUser = userId === friendId;

  const addNewFriend = await addFriend(userId, friendId);

  if (!isValidUser) {
    return res
      .status(404)
      .json({ msg: "This Id doesn't belong to a valid user" });
  }

  if (friendIsNotUser) {
    return res.status(404).json({ msg: "You can't be friend with yourself" });
  }

  if (addNewFriend) {
    return res.status(201).json({ msg: "Friend added" });
  }
  if (!addNewFriend) {
    return res.status(404).json({ msg: "Already Friend" });
  }
});

router.delete(
  "/auth/friends/delete/:friendId",
  checkToken,
  async (req, res) => {
    const friendId = req.params.friendId;
    const decodedToken = jwtDecoder(req.headers.authorization);
    const userId = decodedToken.id;

    const isValidUser = await checkIfValidUserId(friendId);

    const removeFriend = await removeFriendFromList(userId, friendId);

    if (!isValidUser) {
      return res
        .status(404)
        .json({ msg: "This Id doesn't belong to a valid user" });
    }

    if (removeFriend) {
      return res.status(201).json({ msg: "Friend deleted" });
    }
    if (!removeFriend) {
      return res.status(404).json({ msg: "You're not friend with this user" });
    }
  }
);
module.exports = router;
