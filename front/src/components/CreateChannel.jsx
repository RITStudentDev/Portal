import React from "react"
import { useState } from "react"
import { get_current_room, update_current_room} from "../mod/chatroom";

const BASE_URL = import.meta.env.VITE_API_URL;

function  CreateChannel({ roomId, onChannelCreated}) {

    const [creating, setCreating] = useState(false)

    async function handleCreate(e) {
        await fetch(`${BASE_URL}channels/`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({parent_room: roomId}),
        })
        await update_current_room()
        setCreating(false)
        onChannelCreated()
    }

    return (
        <>
            {creating ? (
                <input autoFocus placeholder="Channel name" onBlur={() => setCreating(false)} />
            ) : (
                <button onClick={() => handleCreate()}>+</button>
            )}
        </>
    )
}
export default CreateChannel