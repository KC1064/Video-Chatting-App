const User = require("../models/user.model");
const FriendRequest = require("../models/friendRequest.model");

const recommendedFriend = async (req, res) => {
  try {
    const currUserId = req.user.id;
    const currUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exclude myself
        { _id: { $nin: currentUser.friends } }, // exclude my friends
        { isOnboarded: true }, // should be onboarde to platform
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.log("Error in recommend user logic", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const myFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    if (myId === id) {
      return res
        .status(400)
        .json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);

    if (!recipient) {
      return res.status(400).json({
        message: "Recipient not found",
      });
    }

    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user." });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Friend Request already exists between you two.",
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });
    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendReq controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  recommendedFriend,
  myFriends,
  sendFriendRequest,
};
