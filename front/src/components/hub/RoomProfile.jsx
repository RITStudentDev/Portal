import '../../styles/hub/RoomProfile.css'
import icon from '../../assets/defaultRoom.png'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { get_current_room } from "../../mod/chatroom";

function RoomProfile({ roomId, roomName, bio }) {
    const navigate = useNavigate()

    const handleChatNav = async () => {
        const room = await get_current_room(roomId)

        if (!room) {
            console.log("Room not found")
            return
        }

        const defaultChannel = room.channels.find(channel => channel.is_default)

        if (defaultChannel) {
            navigate(`/chat/${roomId}/${defaultChannel.channel_id}`)
        } else {
            console.log("No default channel found")
        }
    }

    return (
        <div className="room-profile-container">
            <div id='name-container'>
                <h1 className='room-name' onClick={handleChatNav}>{roomName}</h1>
            </div>
            <img src={icon} alt='icon' />
            <div className='bio-container'>
                <p>{bio}</p>
            </div>
        </div>
    )
}

export default RoomProfile;