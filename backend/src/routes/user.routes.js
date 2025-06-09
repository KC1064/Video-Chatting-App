const express = require("express");
const protectedRoute = require("../middlewares/protectedRoutes");
const userController = require("../controllers/user.controllers");
const router = express.Router();

router.use(protectedRoute);

router.get("/", userController.recommendedFriend);
router.get("/friends", userController.myFriends);

router.post("/friend-requests/:id", userController.sendFriendRequest);
router.put("/friend-requests/:id/accept", userController.acceptFriendReq);

router.get("/friend-requests", userController.getFriendReq);
router.get("/outgoing-friend-requests", userController.outgoingFriendReqs);

module.exports = router;
