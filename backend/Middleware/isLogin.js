import jwt from "jsonwebtoken";
import User from "../Models/userModels.js";

const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(500)
        .send({ success: false, message: "User Unauthorized!" });
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode)
      return res
        .status(500)
        .send({ success: false, message: "User Unauthorized! Invalid Token." });
    const user = await User.findById(decode.userId).select("-password");
    if (!user)
      return res
        .status(500)
        .send({ success: false, message: "User not Found." });
    req.user = user;
    next();
  } catch (error) {
    console.log(`Error in isLogin middleware ${error.message}`);
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export default isLogin;
