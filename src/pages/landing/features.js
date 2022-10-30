import React, {Component} from "react";
import "./features.css";
import FeatureEle from "./feature_element";

import {RiCoinsFill} from "react-icons/ri";
import {FcCandleSticks} from "react-icons/fc";
import {GoFileDirectory} from "react-icons/go";
import {BsCashStack} from "react-icons/bs";
import {HiOutlineTrendingUp} from "react-icons/hi";
import {SiSimpleanalytics} from "react-icons/si";

class Features extends Component{
    render(){
        return(
            <div class="feature-wrapper">
                <div class="grid">
                    <div class="one">
                        <div class="f-overlay">
                        <p class="f-heading">Our Features</p>
                        <p class="f-data">We strive to offer elements that will drive everyone who is novice at trading to assess their approaches and discover how to generate significant gains.</p>
                        <a href="/register"><button class="f-button"><span>Sign Up </span></button></a>
                        </div>
                    </div>
                    <div class="two"><FeatureEle name="Virtual Credits" icon={<BsCashStack color="#85bb65"/>} data="Invest using Virtual credits instead of actual money."/></div>
                    <div class="three"><FeatureEle name="Real-Time Trading" icon={<FcCandleSticks/>} data="In sync with the actual stock market."/></div>
                    <div class="four"><FeatureEle name="Optimised Portfolio" icon={<GoFileDirectory color="#050530"/>} data="Smart reccomendations to imporove investments."/></div>
                    <div class="five"><FeatureEle name="Price Predictions" icon={<RiCoinsFill color="gold"/>} data="Choose stocks to get daily predictions."/></div>
                    <div class="six"><FeatureEle name="Trend Predictions" icon={<HiOutlineTrendingUp color="black"/>} data="Bollinger Bands to analyze trends."/></div>
                    <div class="seven"><FeatureEle name="Data Insights" icon={<SiSimpleanalytics color="orangered"/>} data="See how your stocks are performing in the market."/></div>
                </div>
            </div>
        )
    }
}

export default Features;