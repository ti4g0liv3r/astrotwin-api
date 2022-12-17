const express = require("express");
const router = express.Router();

const { jwtDecoder, checkToken } = require("../utils");

const {
  checkIfValidUserId,
  addFriend,
  removeFriendFromList,
} = require("../queries");

///////////////////////////////////////////////////////
//
// -*-*- FRIENDS MANAGEMENT ROUTER -*-*-
//
// * PENDING TASKS HERE
//
// - ADD A ROUTE TO GET ALL FRIENDS FOR THE USER
//
///////////////////////////////////////////////////////

router.put("/:friendId", checkToken, async (req, res) => {
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

router.delete("/delete/:friendId", checkToken, async (req, res) => {
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
});
module.exports = router;
