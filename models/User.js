const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: [true, "Name is required"],
  },
  user_password: {
    type: String,
    required: [true, "Password is required"],
  },
  user_chats: [
    {
      partner: String,
    },
  ],
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
