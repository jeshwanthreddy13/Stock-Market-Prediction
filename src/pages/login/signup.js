import React from "react";
import './login.css';

class SignUp extends React.Component {
      render () {
    return(
        <div className="center">
            <h1>Sign Up</h1>
            <form>
            <div class="inputbox">
                <span>Username</span>
                <input id="username" type="text" required="required"/>
            </div><br/>
            <div class="inputbox">
                <span>Password</span>
                <input id="password" type="text" required="required"/>
            </div><br/>
            <div class="inputbox">
                <span>Phone Number</span>
                <input id="phone" type="text" required="required"/>
            </div><br/>
            <div class="inputbox">
                <input type="button" value="SUBMIT" />
            </div>
            </form>
        </div>
    )
}
}

export default SignUp;