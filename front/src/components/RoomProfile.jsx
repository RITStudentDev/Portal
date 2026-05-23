import '../styles/RoomProfile.css'
import icon from '../assets/defaultRoom.png'
import { Link } from 'react-router-dom';

function RoomProfile({roomId, roomName, bio, channelId}) {


  return (
    <div className="room-profile-container">
        <div id='name-container'>
            <Link to={`/chat/${roomId}/${channelId}`}>
                <h1 className='room-name'>{roomName}</h1>
            </Link>
        </div>
        <img src={icon} alt='icon'/>
        <div className='bio-container'>
            <p>{bio}</p>
        </div>
    </div>
  );
}

export default RoomProfile;