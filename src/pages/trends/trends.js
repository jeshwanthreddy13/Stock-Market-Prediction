import React from 'react';
import './trends.css';
import srb from './srb.png'
import bb from './bb.png'
import Navbar from '../navbar/nav';
const Trends = () => {
    return(
        <>
        <Navbar />
        <div className='trends'>
            <div className='trends-child'>
                <h2>Bolinger Bands</h2>
                <p>Bollinger bands are a technical indicator that can help you define trends and measure the volatility of securities like stocks.<br/><br/>
                    They are calculated using Standard Deviation method using Moving Average.95% of the graph is likely to fall within the upper and lower Bollinger bands.<br/><br/>
                    The graph tends to fall back to the zone when it goes above or below the boundaries. <br/>
                </p>
                <img src={bb} alt="bollinger bands"></img><br/>
                <button className="view-more"><a href = "bollinger-bands">View More</a></button>
            </div>
            <div className='trends-child'>
                <h2>Support and Resistance Bands</h2>
                <p>Support and resistance are specific price points on a chart expected to attract the maximum amount of either buying or selling. They are historic price action levels.<br/><br/>
                    When the price of a security approaches these levels it either critically goes up or down.<br/><br/>        
                    These are important because they indicate if an asset should be sold or bought at that particular price.<br/>
                </p>
                <img src={srb} alt="support and resistance"></img><br/>
                <button className="view-more"><a href = "support-and-resistance">View More</a></button>
            </div>
        </div>
        </>
    )
}

export default Trends;