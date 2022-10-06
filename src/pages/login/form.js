import React  from "react";
import { useState, useRef} from "react";
import Login from "./login";
import SignUp from "./signup";
import "./form.css"

const Form = () => {
    const [login, setLogin] = useState(true)
    const toggleWindow = useRef(null);

    const handleLogin = () =>{
        setLogin(!login);
        toggleWindow.current.classList.toggle("active");
    }

    return(
        <div class="form-container" ref={toggleWindow}>
            <Login />
            <div class="toggle-bar">
                <div class="form-overlay">
                    <p>{login ? "Dont have an account? " : "Alredy have an account?"}</p>
                    <div class="btn btn-form" onClick={handleLogin}><span>{login ? "Sign Up" : "Login"}</span></div>
                </div>
            </div>
            <SignUp />
        </div>
    )
}

export default Form;