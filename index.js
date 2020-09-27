var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const cors = require("cors");
const register = require("./router/register");
const login = require("./router/login");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const dashboard = require("./router/dashboard");
const userlists = require("./router/userlists");
const auth = require("./router/auth");
const dbConnect = require("./dbConnect");
const Chat = require("./models/Chat");

dbConnect();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use("/register", jsonParser, register);
app.use("/login", jsonParser, login);
app.use("/dashboard", [jsonParser, auth], dashboard);
app.use("/userlists", [jsonParser, auth], userlists);

io.on("connection", (socket) => {
  console.log("We have a new connection with socket.io!!!");

  socket.on("join", async ({ name, room }, callback) => {
    const target_room = await Chat.findOne({ room: room });
    if (target_room === null) return;
    io.emit("message_records", target_room);
  });

  socket.on("chatMessage", async (message) => {
    const target_room = await Chat.findOne({ room: message.room });
    if (target_room === null) {
      const newRoom = await Chat.create({
        room: message.room,
        user_chats: [
          {
            sender_name: message.sender_name,
            message: message.text,
            time: message.time,
          },
        ],
      });
      await newRoom.save();
    } else {
      console.log(message.message);
      target_room.user_chats.push({
        sender_name: message.sender_name,
        message: message.message,
        time: message.time,
      });
      await target_room.save();
    }

    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("User has left");
  });
});

http.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
