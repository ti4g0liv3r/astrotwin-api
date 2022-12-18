///////////////////////////////////////////////////////
// -*-*--*-*--*-*- SUGGESTED FEATURES -*-*--*-*--*-*-
//
// * SUGGESTED FEATURES
//
// - ADD "ANNUAL PROFECTIONS" BASED ON ASCENDANT (FR) => BIRTHCHART
// - ADD "INTERESTS" (COMMUNITY LIKE) SECTION (YOGA, TAROT, WICCAN, SPIRITUALITY)
// - ADD POSSIBILITY TO USERS INTERACT THROUGH MESSAGES (SOCKET.IO) INTEGRATION
// - ADD TAROT BIRTH CARDS =>
//   https://tarotismyreligion.tumblr.com/post/88536899559/photoset_iframe/tarotismyreligion/tumblr_n716pim9DI1smm2xn/500/false
// - ADD POSSIBILITY TO USERS INTERACT ON POSTS (LIKE, COMMENT, SHARE)
// - ADD JOURNALING SECTION
// - ADD WIKI PAGE WITH (OLIS, CANDLES, GEMSTONES, INCESES, ETC)
// - ADD USER'S KARMA (BASED ON USER'S ACTIVITY) => ORKUT INSPIRED
//
//
// -*-*--*-*--*-*-  MUST HAVE  -*-*--*-*--*-*-
//
// - ADD A SCRIPT TO DELETE ALL USER'S INFORMATION ONCE ACCOUNT DELETED
//
///////////////////////////////////////////////////////

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
app.use("/auth/user/", usersRoute);
app.use("/auth/friends/", friendsRoute);
app.use("/auth/posts/", postsRoute);
app.use("/auth/birthchart/", birthChartRoute);

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
