const upsertStreamUser = require("../lib/stream");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePic: randomAvatar,
    });

    try {
      await upsertStreamUser({
        id: newUser._id,
        name: newUser.fullName,
        Image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.error("Error: ", error);
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ message: true, user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        message: "All fields are required",
      });
    }

    const isUser = await User.findOne({ email });

    if (!isUser) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const validPass = await isUser.matchPassword(password);

    const token = jwt.sign({ userId: isUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, isUser });

    if (!validPass)
      return res.status(400).json({ message: "Invalid email or password" });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const logout = (req, res) => {
  // res.send("Logout Route");
  res.clearCookie("jwt");
  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
};

const onboarding = async (req, res) => {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(
        `Stream user updated after onboarding for ${updatedUser.fullName}`
      );
    } catch (streamError) {
      console.log(
        "Error updating Stream user during onboarding:",
        streamError.message
      );
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  signup,
  login,
  logout,
  onboarding,
};
