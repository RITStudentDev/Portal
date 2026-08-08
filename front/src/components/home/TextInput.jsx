import '../../styles/home/TextInput.css'
import { useState } from 'react'

function TextInput({ placeholder, type, name, value, onChange }){
    const [focused, setFocused] = useState(false)
    const [filled, setFilled] = useState(false)

    const handleFocus = () => { setFocused(true) }
    const handleBlur = () => { setFocused(false) }
    const handleInput = (e) => {
        if (e.target.value.length > 0){
            setFilled(true)
        }
        else {setFilled(false)}
    }

    return(
        <div className="input-container">
            <div className={`focus-bar ${(focused || filled) ? "active" : ""}`}></div>

            <input
                placeholder={placeholder}
                type={type}
                value={value}
                name={name}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onInput={handleInput}
            />
        </div>
    )
}
export default TextInput