import React from "react";
import { useState } from "react";
import Navbar from "../navbar/nav";
import './support_and_resistance.css';
import { Chart } from "react-google-charts";
import config from "../../config";

const SandR = () =>{
    const [value,setValue] = useState("")
    const [show, setShow] = useState(false);
    const [support,setSupport] = useState([])
    const [resistance,setResistance] = useState([])
    const [s_option,setSoptions] = useState({})
    const [r_option,setRoptions] = useState({})
    const handleChange =(e) => {
        setValue(e.target.value)
    }

    const handleClick = async () => {
        console.log(value)
        if(value === "" || value ==="Choose a Ticker"){
            alert("Choose a Valid Ticker")
        }
        else{
        const response = await fetch(
            `${config.baseUrl}/snr?stock=${value}`, {
              method: "GET"}
        );
        const json = await response.json();
        console.log(json)
        setSupport(json['support'])
        setResistance(json['resistance'])
        setSoptions(json["so"])
        setRoptions(json["ro"])
        setShow(true)
    }
    }

    const handleClose = () =>{
        setShow(false)
    }
    return(
        <>
            <Navbar/>
            <h1 className="snr-title">Support and Resistance</h1>
            <div className="snr-search">
                <select className="snr-select" value={value} onChange={handleChange} >
                    <option>Choose a Ticker</option>
                    <option value="AAPL">AAPL</option>
                    <option value="TSLA">TSLA</option>
                    <option value="MSFT">MSFT</option>
                    <option value="VZ">VZ</option>
                    <option value="AMZN">AMZN</option>
                    <option value="BA">BA</option>
                    <option value="MS">MS</option>
                    <option value="DB">DB</option>
                    <option value="JPM">JPM</option>
                    <option value="META">META</option>
                    <option value="INTC">INTC</option>
                    <option value="GS">GS</option>
                    <option value="HPE">HPE</option>
                    <option value="TCS">TCS</option>
                    <option value="WMT">WMT</option>
                    <option value="T">T</option>
                    <option value="TGT">TGT</option>
                    <option value="WFC">WFC</option>
                    <option value="V">V</option>
                </select>
                <button className="snr-button" onClick={handleClick}>Show Bands</button>
            </div> 
            <div>
                {show ? (
                    <div className="snr-hidden">
                        <button onClick={handleClose}>Close Graph</button>
                        <p>Support Graph</p>
                        <Chart
                            width={"100%"}
                            height={"80%"}
                            chartType="CandlestickChart"
                            data={support}
                              options={{
                                series : s_option,
                                legend: "none",
                                bar: { groupWidth: "100%" }, 
                                candlestick: {
                                    fallingColor: { strokeWidth: 0, fill: "#a52714" }, 
                                    risingColor: { strokeWidth: 0, fill: "#0f9d58" },
                                },
                            }}
                        />
                        <p>Resistance Graph</p>
                        <Chart
                            width={"100%"}
                            height={"80%"}
                            chartType="CandlestickChart"
                            data={resistance}
                              options={{
                                series: r_option,
                                legend: "none",
                                bar: { groupWidth: "100%" }, 
                                candlestick: {
                                    fallingColor: { strokeWidth: 0, fill: "#a52714" }, 
                                    risingColor: { strokeWidth: 0, fill: "#0f9d58" },
                                },
                              }}
                        />
                    </div>
                ) : null}
            </div>
        </>
    )
}

export default SandR;