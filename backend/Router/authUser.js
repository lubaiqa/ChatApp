import express from "express";
import {
  userLogin,
  userLogOut,
  userRegister,
} from "../Controller/userController.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/logout", userLogOut);

export default router;
