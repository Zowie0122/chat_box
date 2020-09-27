const express = require("express");
const router = express.Router();
const dbConnect = require("../dbConnect");
const User = require("../models/User");

dbConnect();

router.get("/", async (req, res) => {
  const { user_name } = req.headers;
  try {
    const users = await User.find({});
    const lists = users
      .filter((user) => user.user_name !== user_name)
      .map((user) => user.user_name);

    res.status(200).json(lists);
  } catch (error) {
    res.status(400).json({ message: "Server Error" });
  }
});

module.exports = router;
