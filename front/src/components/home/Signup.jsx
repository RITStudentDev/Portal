import React, { useState } from 'react'
import '../../styles/home/Signup.css'
import TextInput from './TextInput.jsx'

function Signup (){
    const BASE_URL = import.meta.env.VITE_API_URL;
    
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        password2: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        
        if (formData.password !== formData.password2) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}users/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",  
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("User created successfully");
                setFormData({username: "", password: "", password2: ""});
            } else {
                const serverError = typeof data === "object" ? Object.values(data).flat().join(" ")
                : "Signup failed. Please try again.";
                setError(serverError);
            }
        } catch (error) {
            setError("Error: " + error.message);
        }
    };

    return(
        <div className="signup-box">
            <form onSubmit={handleSubmit}>
                <h2>Sign up</h2>
                <TextInput 
                    placeholder="Username" 
                    type="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <br/>
                <TextInput 
                    placeholder="Password" 
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <br/>
                <TextInput 
                    placeholder="Confirm password" 
                    type="password"
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                />
                <a href='/login'>Already have an account?</a>
                <button type='submit'>Create Account</button>
                {error && <p>{error}</p>}
                {error && <p>{message}</p>}
            </form>
        </div>
    )
}
export default Signup