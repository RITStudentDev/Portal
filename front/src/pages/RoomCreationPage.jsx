import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import HubSideBar from '../components/HubSideBar.jsx'
import '../styles/RoomCreationPage.css'

function RoomCreationPage (){
    const BASE_URL = import.meta.env.VITE_API_URL;
    const [roomName, setRoomName] = useState('')
    const [bio, setBio] = useState('')
    const navigate = useNavigate()
    
    const createRoom = async () => {
        if (!roomName) return

        const response = await fetch(`${BASE_URL}rooms/`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({roomName, bio})
        })
        const roomData = await response.json()

        const channelRes = await fetch(`${BASE_URL}rooms/${roomData.roomId}/channels/`, {
            credentials: 'include'
        })
        const channelData = await channelRes.json()

        if (response.ok){
            const defaultChannel = channelData.channels[0]
            navigate(`/chat/${roomData.roomId}/${defaultChannel.channel_id}/`)
        }
    }

    return(
        <div className="rcp">
            <div className="creation-container">
                <input 
                    className="room-name-input"
                    placeholder="Enter a room name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                ></input>
                <textarea
                    className="room-bio-input"
                    placeholder="Write a description"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                ></textarea>
                <button className="create-button"onClick={createRoom}>Create</button>
            </div>
        </div>
    )
}
export default RoomCreationPage