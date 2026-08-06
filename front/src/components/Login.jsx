import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Signup.css'
import TextInput from './TextInput.jsx'
import { login } from '../mod/user.js'
import { Link } from 'react-router-dom'
import { get_logged_user } from '../mod/user.js'

function Login (){
    
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError(null)
        setMessage(null)

        try {
            await login(username, password)
            await get_logged_user()
            setMessage("Login successful")
            navigate("/hub")
        } catch (err) {
            setError(err?.message || "Login failed")
        }

    }

    return(
        <div className="signup-box">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <br></br>
                <TextInput 
                    placeholder="Username" 
                    type="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br/>
                <TextInput 
                    placeholder="Password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br></br>
                <div>
                    <Link to={'/signup'}>
                        <p>Don't have an account.</p>
                    </Link>
                </div>
                <div>
                    <button className="submit-button" type='submit'>Login</button>
                </div>
                {error && <p>There was an error</p>}
                {error && <p>There was an error</p>}
            </form>
        </div>
    )
}
export default Login