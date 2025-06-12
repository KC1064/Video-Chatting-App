const express = require("express");
const protectedRoute = require("../middlewares/protectedRoutes");
const chatController = require("../controllers/chat.controller");
const router = express.Router();

router.get("/token", protectedRoute, chatController.getStreamToken);

export default router;
