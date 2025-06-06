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

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "strict",
      // secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ message: true, user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const login = (req, res) => {
  res.send("Login Route");
};
const logout = (req, res) => {
  res.send("Logout Route");
};

module.exports = {
  signup,
  login,
  logout,
};
