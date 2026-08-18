import express from "express";
import isLogin from "../Middleware/isLogin.js";
import {
  getCurrentChatters,
  getUserBySearch,
} from "../Controller/userHandlerController.js";

const router = express.Router();

router.get("/search", isLogin, getUserBySearch);
router.get("/currentchatters", isLogin, getCurrentChatters);

export default router;
