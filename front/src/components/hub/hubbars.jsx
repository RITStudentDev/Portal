import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import '../../styles/hub/SideBar.css'
import '../../styles/hub/ControlBar.css'
import CreateChannel from '../chat/CreateChannel'

function ChatSideBar({ room }) {
    const { roomId } = useParams()
    const [ refreshedChannels, setRefreshedChannels] = useState(null)

    const channels = refreshedChannels ?? room.channels ?? []

    const refreshChannels = () => {
        const cached = localStorage.getItem('current_room')
        if (cached) {
            const cachedRoom = JSON.parse(cached)
            setRefreshedChannels(cachedRoom.channels || [])
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
            <CreateChannel roomId={roomId} onChannelCreated={refreshChannels} />
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
                <a href="/createroom"><button>Create server</button></a>
                <a><button>Friends</button></a>
            </div>
            <form>
                <input
                    placeholder='Search room'
                ></input>
            </form>
            <div className='button-container'>
                <a href='/me'><button>Profile</button></a>
            </div>
        </div>
    )
}
export { ControlBar }