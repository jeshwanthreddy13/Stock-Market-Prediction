import {React, Component } from "react";
import './landing.css'
import{VictoryCandlestick} from 'victory';
import {data} from './data_lp';
import Nav from './nav'

class LandingPage extends Component {
    render() {
      return (
        <div class="landing">
          <Nav/>
          <div>
            <VictoryCandlestick candleColors={{ positive: "#43BFC7", negative: "#F70D1A" }}
            candleWidth={20}
            style={{
              data: {
                fillOpacity: 0.7, stroke: "#c43a31", strokeWidth: 3
              },
            }}
            data={data}/>
          </div>
        </div>
    )}
  }

export default LandingPage;