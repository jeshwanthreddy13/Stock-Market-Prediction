import {React, Component } from "react";
import './landing.css'
import Candlestick from "./candles";

class LandingPage extends Component {
    render() {
      return (
        <div class="landing">
          <div>
            <Candlestick/>
          </div>
        </div>
    )}
  }

export default LandingPage;