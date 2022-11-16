import React from "react";
import { useState } from "react";
import Navbar from "../navbar/nav";
import './support_and_resistance.css';
import Chart from "react-apexcharts";
import config from "../../config";

const Bollinger = () =>{
        const [value,setValue] = useState("")
        const [show, setShow] = useState(false);
        const [close, setClose] = useState([]);
        const [sma, setSma] = useState([]);
        const [ub, setUb] = useState([]);
        const [lb, setLb] = useState([]);
        const [data,setData] = useState({})
        const [message,setMessage] = useState("")
        const handleChange =(e) => {
            setValue(e.target.value)
        }
    
        const handleClick = async () => {
            setShow(false)
            setMessage("Please wait while graph loads")
            if(value === "" || value ==="Choose a Ticker"){
                alert("Choose a Valid Ticker")
            }
            else{
                const response = await fetch(
                    `${config.baseUrl}/bollinger?stock=${value}`, {
                      method: "GET"}
                );
                const json = await response.json();

                const temp = {
          
                    series: [{
                        name: "Closing Price",
                        data: json['close']
                    },
                    {
                        name: "Simple Moving Average",
                        data: json['sma']
                    },
                    {
                        name: "Upper Bound",
                        data: json['ub']
                    },
                    {
                        name: "Lower Bound",
                        data: json['lb']
                    }
                ],
                    options: {
                      chart: {
                        height: 350,
                        type: 'line',
                        zoom: {
                          enabled: false
                        }
                      },
                      dataLabels: {
                        enabled: false
                      },
                      stroke: {
                        curve: 'smooth'
                      },
                      title: {
                        text: 'Product Trends by Month',
                        align: 'left'
                      },
                      grid: {
                        row: {
                          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                          opacity: 0.5
                        },
                      },
                      xaxis: {
                        labels: {
                          show: false,
                        }
                      }
                  }};
                
                    setData(temp)
                    setClose(json["close"])
                    setSma(json["sma"])
                    setUb(json["ub"])
                    setLb(json["lb"])
                    setShow(true)
                    setMessage("")
            }
        }
        
    
        const handleClose = () =>{
            setShow(false)
        }
        
    return(
        <>
            <Navbar/>
            <h1 className="snr-title">Bollinger Bands</h1>
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
            <p className="b-mess">{message}</p>
            <div>
                {show ? (
                    <div className="bollinger-hidden">
                        <button onClick={handleClose}>Close Graph</button>
                        <Chart options={data.options} series={data.series} type="line" height={"70%"} width={"100%"}/>
                    </div>
                ) : null}
            </div>
        </>
    )
 }

export default Bollinger;