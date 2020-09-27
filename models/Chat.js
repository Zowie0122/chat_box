const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  room: {
    type: String,
    required: [true, "Room is required"],
  },
  user_chats: [
    {
      sender_name: String,
      message: String,
      time: String,
    },
  ],
});

module.exports = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
