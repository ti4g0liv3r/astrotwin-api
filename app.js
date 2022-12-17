const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const {
  publicRoute,
  usersRoute,
  postsRoute,
  birthChartRoute,
  friendsRoute,
} = require("./routes");

const app = express();
app.use(express.json());
app.use("/", publicRoute);
app.use("auth/user/", usersRoute);
app.use("auth/friends/", friendsRoute);
app.use("auth/posts/", postsRoute);
app.use("auth/birthchart/", birthChartRoute);

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

const port = process.env.PORT || 3000;

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
