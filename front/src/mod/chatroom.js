import { getCookie } from "./user";

const BASE_URL = import.meta.env.VITE_API_URL;

// Adds specified user to current room
export async function add_to_room (contact) {
/*
Takes a user contact as an input ands the user with that contact to 
the current room defined by room ID stored object
*/
    const access_token = getCookie("access_token")
    const roomId = localStorage.getItem('current_room').roomId;

    const response = await fetch(`${BASE_URL}rooms/${roomId}/join/`, {
        method: "POST",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"contact":contact})
    })

    if (!response.ok) throw new Error("Failed to add user to room")
    return await response.json();
}

// Gets data for the room selected on the hub page and saves it to local storage.
export async function get_current_room (roomId) {
    // Gets the room if already saved in local storage and stores in variable
    const cached_room = localStorage.getItem('current_room')
    // Checks if a value is saved to current room and returns the room if it exists
    if(cached_room){
        const room = JSON.parse(cached_room)
        if (room.roomId === roomId) return room
    }

    try{
        // Makes fetch call to get the room with associated id
        const res = await fetch(`${BASE_URL}rooms/${roomId}`, {
            method: "GET",
            credentials: 'include'
        })
        // Checks if the response to the fetch call is valid
        if (!res.ok) throw new Error('Failed to fetch room')
        // Stores valid response JSON into variable to be saved
        const room = await res.json()
        // Saves room JSON object to local storage under "current_room" key
        localStorage.setItem('current_room', JSON.stringify(room))
        return room
    } catch (err){
        throw err
    }
}

// Clears current_room cache
export function clear_room_cache(){
    localStorage.removeItem('current_room')
}
