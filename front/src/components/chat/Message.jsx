import '../../styles/chat/Message.css'
import pfp from '../../assets/defaultpfp.jpg'

function Message({username, content, timestamp}){ 

    return(
        <div className="message-container">  
            <img className='pfp' src={pfp} alt="pfp"></img>
            <div className="content-container">
                <div className='message-meta'>
                    <h3>{username}</h3>
                    <p>{timestamp}</p>
                </div>
                <p>{content}</p>
            </div>
        </div>
    )

}
export default Message