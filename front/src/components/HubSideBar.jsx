import { Link, useParams } from 'react-router-dom'
import { get_current_room } from '../mod/chatroom'
import { useState, useEffect } from 'react'
import '../styles/HubSideBar.css'

function HubSideBar() {
    const { roomId } = useParams()
    const [channels, setChannels] = useState([])

    useEffect(() => {
        if (!roomId) return
        const fetchRoom = async () => {
            const data = await get_current_room(roomId)
            if (data?.channels) setChannels(data.channels)
        }
        fetchRoom()
    }, [roomId])

    return (
        <div className="sidebar">
            <ul>
                <span>
                    <Link to={'/hub'}>
                        <svg className="home-button" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M13.9897 20.9982H19.0001V12H21.0001L12.0001 3L3.04309 12H5.00006V20.9982H10.0001V15.5H13.9897V20.9982Z" stroke="#e2e0f2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                    </Link>
                </span>
                <hr/>
                <ul>
                    {channels.map(channel => (
                        <li key={channel.channel_id}>
                            <Link to={`/chat/${roomId}/${channel.channel_id}`}>
                                # {channel.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </ul>
        </div>
    )
}

export default HubSideBar