const mongoose = require("mongoose");

const Friends = mongoose.model("Friends", {
  userId: String,
  friendsIdList: Array,
});

module.exports = Friends;
