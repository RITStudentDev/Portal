import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/home/Signup.css'
import TextInput from './TextInput.jsx'
import { login } from '../../mod/user.js'
import { get_logged_user } from '../../mod/user.js'

function Login (){
    
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError(null)

        try {
            await login(username, password)
            await get_logged_user()
            navigate("/hub")
        } catch (err) {
            setError(err?.message || "Login failed")
        }

    }

    return(
        <div className="signup-box">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
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
                <a href='/signup'>Don't have an account?</a>
                <button className="submit-button" type='submit'>Login</button>
                {error && <p>There was an error</p>}
                {error && <p>There was an error</p>}
            </form>
        </div>
    )
}
export default Login