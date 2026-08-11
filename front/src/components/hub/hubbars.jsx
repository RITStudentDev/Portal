import { useParams, Link } from 'react-router-dom'
import { get_current_room} from '../../mod/chatroom'
import { useState, useEffect } from 'react'
import '../../styles/hub/SideBar.css'
import '../../styles/hub/ControlBar.css'
import CreateChannel from '../chat/CreateChannel'

function ChatSideBar() {
    const { roomId } = useParams()
    const [channels, setChannels] = useState([])
    const [room, setRoom] = useState({})

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

    return (
        <div id="chat" className="sidebar">
            <h3>{room.roomName}</h3>
            <ul>
                <h4>Text Channels</h4>
                <ul>
                    {channels.map(channel => (
                        <li key={channel.channel_id}>
                            <a href={`/chat/${roomId}/${channel.channel_id}`}>
                                # {channel.name}
                            </a>
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
        <div id="hub" className="sidebar">
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