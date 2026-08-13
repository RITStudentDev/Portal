import "../styles/hub/HubPage.css"
import { clear_room_cache } from "../mod/chatroom"
import { useState, useEffect } from "react"
import RoomProfile from "../components/hub/RoomProfile"
import { ControlBar, HubSideBar } from "../components/hub/hubbars"

import { get_memberships } from "../mod/user"

function HubPage (){

    clear_room_cache();

    const [rooms, setRooms ] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
    const fetchRooms = async () => {
        const rooms = await get_memberships()
        setRooms(rooms)
        setLoading(false)
    }
    fetchRooms()
}, [])

    return(
        <div className="page">
            <HubSideBar/>
            <div className="main-view">
                <ControlBar/>
                <div className="room-scroller">
                    <div className="room-container">
                        {loading ? (
                            <p>Loading...</p>
                        ) : rooms.length === 0 ? (
                            <p>No rooms found</p>
                        ) : (
                            rooms.map((room) => (
                                <RoomProfile
                                    key={room.roomId}
                                    roomId={room.roomId}
                                    roomName={room.roomName}
                                    bio={room.bio}
                                    channelId={room.channel_id}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default HubPage