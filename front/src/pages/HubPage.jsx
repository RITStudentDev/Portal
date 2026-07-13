import "../styles/HubPage.css"
import { useState, useEffect } from "react"
import RoomProfile from "../components/RoomProfile"
import { useNavigate } from "react-router-dom"

import { get_memberships } from "../mod/user"

function HubPage (){

    const [rooms, setRooms ] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
    const fetchRooms = async () => {
        const rooms = await get_memberships()
        setRooms(rooms)
        setLoading(false)
    }
    fetchRooms()
}, [])

    const handleCRRoute  = () => {
        navigate('/createroom')
    }
    const handeMeRoute = () => {
        navigate('/me')
    }

    return(
        <div className="page">
            <div className="main-view">
                <div className="head-bar">
                    <button className="header-button" onClick={handleCRRoute}>+</button>
                    <button className="header-button">F</button>
                    <input
                        className="room-search"
                        placeholder="Search"
                    ></input>
                    <button className="header-button" onClick={handeMeRoute}>Me</button>
                </div>
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