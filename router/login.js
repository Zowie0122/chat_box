const express = require("express");
const router = express.Router();
const { sign } = require("jsonwebtoken");
const { compare } = require("bcrypt");
const dbConnect = require("../dbConnect");
const User = require("../models/User");
require("dotenv").config();

dbConnect();

router.post("/", async (req, res) => {
  try {
    const { user_name, user_password } = req.body;
    const user = await User.findOne({
      user_name: user_name,
    });

    if (user !== undefined) {
      compare(user_password, user.user_password, function (err) {
        if (!err) {
          const claims = { sub: user._id };
          const jwt = sign(claims, process.env.SECRET_TOKEN, {
            expiresIn: "3h",
          });
          res.status(200).json({ authToken: jwt, userId: user._id });
        } else {
          res
            .status(400)
            .json({ message: "Username and password are not matched" });
        }
      });
    } else {
      res.status(200).json({ message: "You are not registered." });
    }
  } catch (error) {
    res.status(400).json({ message: "Server Error On Login" });
  }
});

module.exports = router;
