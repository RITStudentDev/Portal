import { useNavigate, useParams, Link } from 'react-router-dom'
import { get_current_room, clear_room_cache } from '../../mod/chatroom'
import { useState, useEffect } from 'react'
import '../../styles/hub/SideBar.css'
import '../../styles/hub/ControlBar.css'
import CreateChannel from '../chat/CreateChannel'

function ChatSideBar() {
    const { roomId } = useParams()
    const [channels, setChannels] = useState([])
    const [room, setRoom] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        if (!roomId) return
        const fetchRoom = async () => {
            const data = await get_current_room(roomId)
            if (data) setRoom(data)
            if (data?.channels) setChannels(data.channels)
            
        }
        fetchRoom()
    }, [roomId])

    const refreshChannels = () => {
    const cached = localStorage.getItem('current_room')
    if (cached) {
        const room = JSON.parse(cached)
        setRoom(room)
        setChannels(room.channels || [])
    }
}

    const handleBack = () => {
        clear_room_cache()
        navigate("/hub")
    }

    return (
        <div className="sidebar">
            <ul>
                <span onClick={handleBack}>
                    <svg className="home-button" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M13.9897 20.9982H19.0001V12H21.0001L12.0001 3L3.04309 12H5.00006V20.9982H10.0001V15.5H13.9897V20.9982Z" stroke="#e2e0f2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> </svg>
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
            <CreateChannel roomId={roomId} onChannelCreated={refreshChannels}/>
        </div>
    )
}
export { ChatSideBar }

function HubSideBar() {

    return (
        <div className="sidebar">
            <button><a>⚙︎</a></button>
        </div>
    )
}
export { HubSideBar }

function ControlBar(){
    return(
        <div className="control-bar">
            <div className='button-container'>
                <a href="/createroom"><button>+</button></a>
                <a><button>F</button></a>
            </div>
            <form>
                <input
                    placeholder='Search room'
                ></input>
            </form>
            <div className='button-container'>
                <a href='/me'><button>A</button></a>
            </div>
        </div>
    )
}
export { ControlBar }