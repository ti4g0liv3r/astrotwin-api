const Friends = require("../models/Friends");
const User = require("../models/User");
const { save, find, findAll, updateOne } = require("./basicQuery");

const grabFriendListByUserId = async (userId) => {
  const userFriendList = await find(Friends, { userId: userId });

  return userFriendList.length !== 0 ? userFriendList[0].friendsIdList : false;
};

const grabAllUserFriends = async (userId) => {
  const friendList = await grabFriendListByUserId(userId);
  if (friendList) {
    const userList = await findAll(User, {
      dbQuery: { _id: friendList },
      options: { password: 0 },
    });

    console.log("friendsArray:", userList);
    return userList;
  }

  return friendList;
};

const checkIfIsFriend = (friendId, friendsIdList) => {
  const isFriend = friendsIdList.includes(friendId);
  return isFriend;
};

const createFriendList = async (userId, friendList) => {
  const newFriendIdList = new Friends({
    userId: userId,
    friendsIdList: friendList,
  });

  await save(newFriendIdList);

  return newFriendIdList;
};

const updateFriendList = async (updateData) => {
  const updateFriends = await updateOne(Friends, updateData);
  return updateFriends;
};

const addFriend = async (userId, friendId) => {
  const userFriendList = await grabFriendListByUserId(userId);
  const isFriendAlready = checkIfIsFriend(friendId, userFriendList);

  if (isFriendAlready) {
    return false;
  }

  if (userFriendList) {
    let friendList = [friendId];
    const newFriendList = await createFriendList(userId, friendList);

    return newFriendList;
  } else {
    const friendList = [...userFriendList, friendId];
    const updateData = {
      userId,
      friendsIdList: friendList,
    };
    const listToUpdate = await updateFriendList(updateData);
    return listToUpdate;
  }
};

const removeFriendFromList = async (userId, friendId) => {
  const userFriendList = await grabFriendListByUserId(userId);
  const isFriend = checkIfIsFriend(friendId, userFriendList);

  if (isFriend) {
    const newFriendList = userFriendList.filter(
      (friend) => friend !== friendId
    );

    const updateData = {
      userId,
      friendsIdList: newFriendList,
    };

    const friendList = await updateFriendList(updateData);

    return friendList;
  } else {
    return false;
  }
};

module.exports = { addFriend, removeFriendFromList, grabAllUserFriends };
