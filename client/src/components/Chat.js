import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./app.scss";
import { Scrollbars } from "react-custom-scrollbars";

let socket;

const Chat = ({ name, room, partner }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState([]);

  const ENDPOINT = "http://localhost:5000";

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("join", { name, room }, () => {});
    socket.on("message_records", (target_room) => {
      setMessages(target_room.user_chats);
    });

    return () => {
      setMessages([]);
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, name, room]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  const sendMessageHandler = (event) => {
    event.preventDefault();
    if (message === "") {
      setError("Message can not be empty!");
    } else {
      socket.emit("chatMessage", {
        time: new Date().toLocaleString({ timeZone: "Asia/Tokyo" }),
        message: message,
        room: room,
        sender_name: name,
      });
    }
  };

  return (
    <div className="chatBox">
      <h1>Chat with {partner}</h1>

      <Scrollbars style={{ height: 500 }}>
        {messages.length !== 0 &&
          messages.map((m) => (
            <div
              className={m.sender_name === name ? "self" : "partner"}
              key={m._id}
            >
              <div className="message">{m.message}</div>
              <div className="time">{m.time}</div>
            </div>
          ))}
      </Scrollbars>

      <div>
        <div>
          <textarea
            rows="10"
            className="inputTextarea"
            value={message}
            placeholder="Type here"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyPress={(event) =>
              event.key === "Enter" ? setMessage(message + "\n") : null
            }
          />
        </div>
        {error !== null && <p>{error}</p>}
        <div>
          <button
            className="messageSendButton"
            type="text"
            onClick={(event) => sendMessageHandler(event)}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
