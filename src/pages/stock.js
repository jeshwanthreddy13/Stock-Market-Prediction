import React, {useState, useEffect} from 'react';
import config from "../config";
import {HiTrendingUp} from "react-icons/hi";
import Chart from "react-apexcharts";
import { getValue } from '@testing-library/user-event/dist/utils';
import "./stock.css"
import Navbar from './navbar/nav';
const Stock = () => {

    const [stock, setStock] = useState({data: []});
    var stock_array = []
    const queryParams = new URLSearchParams(window.location.search);
    const GetStocks = async () => {
        const stock_name = (queryParams.get('stock'))
        const response = await fetch(
            `${config.baseUrl}/stocks/?stock=${stock_name}`
        );
        const json = await response.json();
        return json
    };
  
    useEffect(() => {
      async function a(){
        try {
        const response = await GetStocks();
        console.log(response.length)
        stock_array = []
        response.map((data) => {
            var temp = [data.Date,data.Open, data.High, data.Low, data.Close]
            stock_array.push(temp)
        })
        setStock({data: stock_array})
      } catch (error) {
        setStock({ apiError: error });
      }
    }
    a();
    }, []);

    var options = {
        series: [{
        data: stock.data
      }],
        chart: {
        type: 'candlestick',
        height: 350
      },
      title: {
        text: 'CandleStick Chart',
        align: 'left'
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
      };

    return (
        <>
            <Navbar /> 
            <h2>Data for {queryParams.get('stock')} Stocks</h2>
            <div className="candle-chart"><Chart options={options} series={options.series} type="candlestick" height={"70%"} width={"100%"} /></div>
        </>
    );
  };
  
  export default Stock;