import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { AddUserWindow } from "../components/AddUser";
import { get_current_room } from "../mod/chatroom";

import "../styles/RoomChatPage.css";
import ChatInput from "../components/ChatInput";
import HubSideBar from "../components/HubSideBar";
import Message from "../components/Message";

function ServerChatPage() {
  const WS_URL = import.meta.env.VITE_WS_URL;
  const BASE_URL = import.meta.env.VITE_API_URL;

  const { roomId, channelId } = useParams()

  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [channelName, setChannelName] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!roomId) return
    const fetchRoom = async () => {
      const room = await get_current_room(roomId)
      console.log(room)
      if (room) setRoomName(room.roomName)
    }
    fetchRoom()
  }, [roomId])

  return (
    <div className="chat-page">
      <HubSideBar />
      <div className="chat-view">
        <div className="chat-head">
          <h3 className="channel-title">{channelName}</h3>
          <div className="add-user-container">
            <button onClick={() => setVisible(true)}>Add member</button>
            <AddUserWindow visible={visible} onClose={() => setVisible(false)} />
          </div>
        </div>
        <div className="chat-list">
          <ul>
            {messages.map((message, index) => (
              <Message
                key={index}
                username={message.sender_username}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
          </ul>
        </div>
        {/*<ChatInput/>*/}
      </div>
    </div>
  );
}

export default ServerChatPage;