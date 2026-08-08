import React from "react"
import { useState } from "react"
import { update_current_room} from "../../mod/chatroom";

const BASE_URL = import.meta.env.VITE_API_URL;

function  CreateChannel({ roomId, onChannelCreated}) {

    const [creating, setCreating] = useState(false)
    const [ channelName, setName] = useState("")

    async function handleCreate(e) {
        await fetch(`${BASE_URL}channels/`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({parent_room: roomId, name: channelName}),
        })
        await update_current_room()
        setName("")
        setCreating(false)
        onChannelCreated()
    }

    return (
        <>
            {creating ? (
                <input 
                    autoFocus
                    value={channelName}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleCreate()}
                    onBlur={handleCreate}
                    placeholder="Channel name"
                />
            ) : (
                <button onClick={() => setCreating(true)}>+</button>
            )}
        </>
    )
}
export default CreateChannel