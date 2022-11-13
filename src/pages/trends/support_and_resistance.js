import React from "react";
import { useState } from "react";
import Navbar from "../navbar/nav";
import './support_and_resistance.css';
import { Chart } from "react-google-charts";

const SandR = () =>{
    const [value,setValue] = useState("")
    const [show, setShow] = useState(false);

    const handleChange =(e) => {
        setValue(e.target.value)
    }

    const handleClick = () => {
        console.log(value)
        setShow(true)
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
                    <option value="AAPL" default>AAPL</option>
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
                        <p>Support and Resistance Bands for {value}</p>
                        <Chart
                            width={"500px"}
                            height={"300px"}
                            chartType="CandlestickChart"
                            loader={<div>Loading Chart</div>}
                            data={[
                            ["day", "a", "b", "c", "d", "Medium", "medium2"],
                            ["2004/05", 0, 0, 40, 40, 450, 682],
                            ["2005/06", 135, 1120, 599, 1268, 450, 682],
                            ["2006/07", 157, 1167, 587, 807, 450, 682],
                            ["2007/08", 139, 1110, 615, 968, 450, 682],
                            ["2008/09", 136, 691, 629, 1026, 450, 682]
                            ]}
                            options={{
                            series: {
                                1: { type: "line" },
                                2: { type: "line" }
                            }
                            }}
                        />
                    </div>
                ) : null}
            </div>
        </>
    )
}

export default SandR;