const express = require("express");
const router = express.Router();
const { sign } = require("jsonwebtoken");
const dbConnect = require("../dbConnect");
const User = require("../models/User");
require("dotenv").config();

dbConnect();

router.post("/", async (req, res) => {
  try {
    const { user_name } = req.body;
    const user = await User.findOne({
      user_name: user_name,
    });

    if (user === null) {
      const newUser = await User.create(req.body);
      await newUser.save();
      const claims = { sub: newUser._id };
      const jwt = sign(claims, process.env.SECRET_TOKEN, {
        expiresIn: "3h",
      });
      res.status(200).json({ authToken: jwt, userId: newUser._id });
    } else {
      res.status(200).json({ message: "This username has been registered!" });
    }
  } catch (error) {
    res.status(400).json({ message: "Server Error On Registration" });
  }
});

module.exports = router;
