import User from "../Models/userModels.js";
import bcrypt from "bcryptjs";
import jwtToken from "../Utils/jwtWebToken.js";

export const userRegister = async (req, res) => {
  try {
    const { fullname, username, email, gender, password, profilepic } =
      req.body;

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user)
      return res
        .status(400)
        .send({ success: false, message: "Username or Email already exist!" });

    const hashPassword = bcrypt.hashSync(password, 10);
    const avatar =
      profilepic ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashPassword,
      gender,
      profilepic: avatar,
    });

    await newUser.save();
    jwtToken(newUser._id, res);

    return res.status(201).send({
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      profilepic: newUser.profilepic,
      email: newUser.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .send({ success: false, message: "Email doesn't exist!" });

    const comparePass = bcrypt.compareSync(password, user.password || "");
    if (!comparePass)
      return res
        .status(400)
        .send({ success: false, message: "Email or Password doesn't match!" });

    jwtToken(user._id, res);

    return res.status(200).send({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      profilepic: user.profilepic,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const userLogOut = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    res.status(200).send({ success: true, message: "User Logged Out!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};
