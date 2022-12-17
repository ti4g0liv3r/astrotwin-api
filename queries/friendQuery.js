const Friends = require("../models/Friends");
const { save, find, updateOne } = require("./basicQuery");

const grabFriendListByUserId = async (userId) => {
  const userFriendList = await find(Friends, { userId: userId });

  return userFriendList ? userFriendList[0].friendsIdList : userFriendList;
};

const checkIfIsFriend = (friendId, friendsIdList) => {
  const isFriend = friendsIdList.includes(friendId);
  return isFriend;
};

const createFriendList = async (userId, friendList) => {
  const newFriendIdList = new Friends({
    userId: userId,
    friendsIdList: friendList,
  })
    .then((res) => res)
    .catch((err) => err);

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

  if (userFriendList.length === 0) {
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

module.exports = { addFriend, removeFriendFromList };
