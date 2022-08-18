import {React, Component } from "react";
import './nav.css'

class Nav extends Component {
    render() {
      return (
      <div>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="about">About Us</a></li>
                <li><a href="services">Services</a></li>
                <button>Login</button>
            </ul>
      </div>
    )}
  }

export default Nav;