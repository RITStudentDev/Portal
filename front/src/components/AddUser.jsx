import { add_to_room } from '../mod/chatroom'
import '../styles/AddUser.css'
import { useState } from 'react'

export function AddUserWindow ({visible, onClose}){

    const [contact, setContact] = useState("")

    if (!visible) return null

    const handleAdd = async () => {
        await add_to_room(contact)
    }

    return (
        <div className="add-user-window">
            <button className='close' onClick={onClose}>x</button>
            <input
                value={contact}
                placeholder="Enter contact"
                onChange={(e) => setContact(e.target.value)}
            />
            <button onClick={handleAdd}>Add</button>
        </div>
    )
}