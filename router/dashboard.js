const express = require("express");
const router = express.Router();
const dbConnect = require("../dbConnect");
const User = require("../models/User");

dbConnect();

router.get("/", async (req, res) => {
  try {
    const { user_name } = req.headers;
    const user = await User.findOne({
      user_name: user_name,
    });

    if (user !== null) {
      res.status(200).send(user);
    } else {
      res.status(400).json({ message: "Server Error" });
    }
  } catch (error) {
    res.status(400).json({ message: "Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { user_name, partner } = req.body;
    const user = await User.findOne({
      user_name: user_name,
    });
    const partner_user = await User.findOne({
      user_name: partner,
    });

    if (user !== null && partner_user !== null) {
      user.user_chats = user.user_chats.filter(
        (ele) => ele.partner !== partner
      );
      user.user_chats.unshift({ partner: partner });
      await user.save();

      partner_user.user_chats = partner_user.user_chats.filter(
        (ele) => ele.partner !== user_name
      );
      partner_user.user_chats.unshift({ partner: user_name });

      await partner_user.save();

      res.status(200).send({ message: "Recent Partner Saved" });
    } else {
      res.status(400).json({ message: "Server Error" });
    }
  } catch (error) {
    res.status(400).json({ message: "Server Error" });
  }
});

module.exports = router;
