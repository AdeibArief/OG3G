import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import protect from "../middleware/protect.js";

const router = express.Router();

const sendTokenCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

router.post("/register", async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ userName, email, password });
    sendTokenCookie(res, user._id);

    res
      .status(200)
      .json({ _id: user._id, userName: user.userName, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid user or Password" });
    }

    sendTokenCookie(res, user._id);
    res
      .status(200)
      .json({ _id: user._id, userName: user.userName, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/logout", (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged Out" });
});

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});
export default router;
