import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { AddUserWindow } from "../components/chat/AddUser";
import { get_current_room } from "../mod/chatroom";

import "../styles/chat/RoomChatPage.css";
import ChatInput from "../components/chat/ChatInput";
import { HubSideBar, ChatSideBar } from "../components/hub/hubbars";
import Message from "../components/chat/Message";


// TODO: Call room data from page and pass data down to components through props
//       rather than having separate calls. 
function ServerChatPage() {
  const WS_URL = import.meta.env.VITE_WS_URL;
  const BASE_URL = import.meta.env.VITE_API_URL;

  const { roomId, channelId } = useParams()
  const ws = useRef(null)

  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState({});
  const [channelName, setChannelName] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!roomId) return
    const fetchRoom = async () => {
        const room = await get_current_room(roomId)
        if (room) {
            setRoom(room)
            const channel = room.channels.find(c => c.channel_id === channelId)
            if (channel) setChannelName(channel.name)
        }
    }
    fetchRoom()
}, [roomId, channelId])

  useEffect(() => {
    if (!channelId) return
    setMessages([])

    const fetchMessages = async () => {
        const res = await fetch(`${BASE_URL}messages/channel/${channelId}/`, {
            credentials: 'include'
        })
        const data = await res.json()
        setMessages(data.messages)
    }
    fetchMessages()

    ws.current = new WebSocket(`${WS_URL}ws/chat/${channelId}/`)
    ws.current.onopen = () => console.log("WebSocket connected")
    ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data)
        setMessages(prev => [...prev, data])
    }
    ws.current.onclose = () => console.log("WebSocket disconnected")

    return () => ws.current.close()
}, [channelId])

  return (
    <div className="chat-page">
      <HubSideBar />
      <ChatSideBar/>
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
        <ChatInput ws={ws} roomId={roomId} channelId={channelId}/>
      </div>
    </div>
  );
}

export default ServerChatPage;