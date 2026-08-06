import { get_logged_user } from "../mod/user"
import { useEffect, useState } from "react";
import '../styles/MePage.css'

function Me (){

    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchMe = async () => {
            const logged_user = await get_logged_user();
            setUser(logged_user);
        }
        fetchMe()
    }, [])

    
    if (!user) return <p>loading...</p>

    return (
        <div className="me-page">
            <p>Username: {user.username}</p>
            <p>Contact: {user.contact}</p>
        </div>
    )
}
export default Me;