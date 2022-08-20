import {React, Component } from "react";
import './about.css'
import portfolio from '../assets/about/portfolio.png'
import credits from '../assets/about/credits.png'
import prediction from '../assets/about/prediction.png'
import trading from '../assets/about/trading.png'

class About extends Component {
    render() {
      return (
        <div class="about">
           <div class="about-icons">
           <div class="grid-container">
            <div class="grid-item">
                <img src={portfolio}/>
                <p>Customised Portfolio</p>
            </div>
            <div class="grid-item">
                <img src={credits}/>
                <p>Virtual Credits</p>
            </div>
            <div class="grid-item">
                <img src={trading}/>
                <p>Live Stock Trading</p>
            </div>
            <div class="grid-item">
                <img src={prediction}/>
                <p>Price Predictions</p>
            </div>
           </div>
           </div>
           <div class="about-data">
            <p class="base-text">OUR GOAL</p>
            <p class="over-text">Our Goal</p>
            <p class="data">Our efforts have been directed towards providing a platform that can be used by anyone who wants to analyze their strategy before they can start trading. They can also use it to manage their portfolio and see how their stocks are performing in the market. We have features such as virtual credits and price predictions. It tends to aim for a wide type of audience because no one would want to start investing in a financially risky asset without knowing the how-it-works insight.</p>
           </div>
        </div>
    )}
  }

export default About;