const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const protectedRoute = require("../middlewares/protectedRoutes");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/onboarding", protectedRoute, authController.onboarding);

//Check if user is logged in or not
router.get("/me", protectedRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

module.exports = router;
