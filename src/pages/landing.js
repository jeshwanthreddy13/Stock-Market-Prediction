import {React, Component } from "react";
import './landing.css'

class LandingPage extends Component {
    render() {
      return (
      <div>
        <ul>
            <li><a href="home">Home</a></li>
            <li><a href="about">About Us</a></li>
            <li><a href="services">Services</a></li>
        </ul>
      </div>
    )}
  }

export default LandingPage;