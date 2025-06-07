const express = require("express");
const protectedRoute = require("../middlewares/protectedRoutes");
const userController = require("../controllers/user.controllers");
const router = express.Router();

router.use(protectedRoute);

router.get("/", userController.recommendedFriend);
router.get("/friends", userController.myFriends);

module.exports = router;
