import React, { useState , useEffect} from "react";
import config from "../../config";
import Chart from "react-apexcharts";
import "./recommendation.css"
import Navbar from "../navbar/nav"
const Recommendation = () => {
    const [data,setData] = useState({});
    const [stocks,setStocks] = useState([]);
    const [values,setValues] = useState([]);
    const [finalvalue,setFinalvalue] = useState(0);
    useEffect(() => {
        fetch(`${config.baseUrl}/rl/get_stored_data`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        })
          .then((res) => res.json())
          .then(({stocks}) => {
            console.log(typeof(JSON.parse(stocks.stock_units)))
            const temp = {
                stock_units: JSON.parse(stocks.stock_units),
                value: stocks.value
            }
            const keys = Object.keys(temp.stock_units);
            var arr = [];
            keys.map((value) => {
                arr.push(temp.stock_units[value])
            })
            setValues(arr);
            setFinalvalue(temp.value.slice(-1))
            setStocks(keys);
            setData(temp);

          })
    }, []);
    const graph = {
          
        series: [{
            name: "Portfolio value",
            data: data.value
        }],
        options: {
          chart: {
            type: 'line',
            zoom: {
              enabled: false
            },
          },
          colors: [
            '#86190a'
          ],

          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth'
          },
          title: {
            text: 'Portfolio Values',
            align: 'center'
          },
          xaxis: {
            labels: {
                show: false
            }
          },
          dropShadow: {
            enabled: true,
            top: 10,
            left: 10,
            blur: 3,
            opacity: 1
          },
          grid: {
            row: {
              colors: ['#f3f3f3', 'transparent'], 
              opacity: 0.5
            },
          },
        },
      };

    const bar = {
          
        series: [{
            name: "Number of Stocks to buy",
            data: values
        }],
        options: {
          chart: {
            type: 'bar',
            zoom: {
              enabled: false
            },
          },
          plotOptions: {
            bar: {
                distributed: true, 
            },
            }, 
          dataLabels: {
            enabled: false
          },
          dropShadow: {
            enabled: true,
            top: 10,
            left: 10,
            blur: 3,
            opacity: 1
          },
          stroke: {
            curve: 'straight'
          },
          title: {
            text: 'Number of stock units to buy',
            align: 'center'
          },
          xaxis: {
            categories: stocks
          }
        },
    };
      
    
    return (
        <div>
            <Navbar/>
            <div>
                <p>Optimal Investment: 
                {stocks.map((value) => {
                    return (<div><h2>{value} {data.stock_units[value]}</h2>
                </div>)
                })}
                <h2>Final portfolio value: {finalvalue}</h2>
                </p>
            </div>
            <div className="graph">
            <Chart options={graph.options} series={graph.series} type="line" height={"90%"} width={"100%"}/>
            </div>
            <div className="graph">
            <Chart options={bar.options} series={bar.series} type="bar" height={"90%"} width={"100%"}/>
            </div>
        </div>
    )
}
export default Recommendation;