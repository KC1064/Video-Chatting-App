const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized User",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized User",
      });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized User",
      });
    }
    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = protectedRoute;
