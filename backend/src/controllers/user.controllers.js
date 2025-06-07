const User = require("../models/user.model");

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
module.exports = {
  recommendedFriend,
  myFriends,
};
