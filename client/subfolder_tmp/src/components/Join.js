import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Chat from "./Chat";
import "./app.scss";

const Join = () => {
  const history = useHistory();
  const [name, setName] = useState(null);
  const [contacts, setContacts] = useState(null);
  const [target, setTarget] = useState(null);
  const [room, setRoom] = useState("*");
  const [chatRecords, setChatRecords] = useState(null);

  const user_name = localStorage.getItem("name");
  const id = localStorage.getItem("id");
  const authtoken = localStorage.getItem("auth");
  const headers = {
    user_name: user_name,
    id: id,
    authtoken: authtoken,
  };

  const fetchData = async () => {
    if (user_name && id && authtoken) {
      setName(user_name);

      const chatRes = await axios.get("http://localhost:5000/dashboard", {
        headers: headers,
      });
      setChatRecords(chatRes.data.user_chats);

      const listRes = await axios.get("http://localhost:5000/userlists", {
        headers: headers,
      });

      setContacts(listRes.data);
    } else {
      history.push("/");
    }
  };

  const saveToRecentContactList = async () => {
    const res = await axios.post(
      "http://localhost:5000/dashboard",
      { user_name: name, partner: target },
      { headers: headers }
    );
    console.log(res.message);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [target]);

  useEffect(() => {
    const roomName = [name, target].sort().join("*");
    setRoom(roomName);

    saveToRecentContactList();
    // eslint-disable-next-line
    fetchData();
    // eslint-disable-next-line
  }, [target]);

  return (
    <div className="joinContainer">
      <div className="recentChats">
        <h1>Recent Chats</h1>

        {chatRecords !== null && chatRecords.length > 0 && (
          <div className="recentList">
            {chatRecords.map((chat) => (
              <p
                onClick={() => {
                  setTarget(chat.partner);
                }}
              >
                {chat.partner}
              </p>
            ))}
          </div>
        )}
      </div>
      <div>
        {room !== "*" && <Chat name={name} room={room} partner={target} />}
      </div>

      <div className="allContacts">
        {" "}
        <div
          className="contact"
          onClick={() => {
            localStorage.clear();
            history.push("/");
          }}
        >
          Logout
        </div>
        <h1>All contacts</h1>
        {contacts !== null && (
          <div>
            {contacts.map((contact) => (
              <div
                className="contact"
                onClick={() => {
                  setTarget(contact);
                }}
              >
                {contact}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Join;
