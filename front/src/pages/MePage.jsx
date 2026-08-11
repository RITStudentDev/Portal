import { get_logged_user } from "../mod/user"
import { useEffect, useState } from "react";
import pfp from '../assets/defaultpfp.jpg'
import '../styles/user/MePage.css'

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
            <div className="profile-container">
                <div style={{display: "flex", gap: "25px", background: "#0e0f10", padding: "12px", borderRadius: "12px"}}>
                    <div style={{height: "110.39px", aspectRatio: "1 / 1"}}>
                        <img id="pfp" src={pfp} alt="Profile picture"></img>
                    </div>
                    <div>
                        <h2>{user.username}</h2>
                        <p>Contact: {user.contact}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Me;