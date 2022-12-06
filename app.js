require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { passwordEncrypt, passwordCompare } = require("./utils/passwordEncrypt");
const { findUser } = require("./queries/index");
const port = process.env.PORT || 3000;

const app = express();

//Config JSON response

app.use(express.json());

//Models

const User = require("./models/User");

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

mongoose.set("strictQuery", true);

mongoose
  .connect(
    `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@reactprojects.h15tnw7.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(port);
    console.log(`Server listening on port ${port}`);
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.status(200).json({ msg: "hello world" });
});

//Private route

const checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Not autorized" });
  }

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (error) {
    return res.status(400).json({ msg: "Invalid token" });
  }
};

app.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  //check if user exists

  const user = await findUser(id);

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  res.status(200).json({ user });
});

//Register User

app.post("/auth/register", async (req, res) => {
  console.log("Registration called");
  const { name, email, password, confirmPasspord } = req.body;

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

  const passwordHash = await passwordEncrypt(password, 12);

  //create the user

  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();

    return res.status(201).json({ msg: "User created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Oops! something went wrong" });
  }
});

app.post("/auth/login", async (req, res) => {
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
    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );
    res.status(200).json({ msg: "User authenticated!", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Oops! something went wrong", token });
  }
});
