import Data from "./portfolio_data.json";
import {useState} from "react";
import React from "react";
import Card from "./portfolio_search_card";
import './portfolio_stock_search.css';
import SearchBar from "./portfolio_search_bar";
import Amount from "./portfolio_amount";
import Fuse from "fuse.js";
import Navbar from "../navbar/nav";
import config from "../../config";
import {FaDollarSign} from "react-icons/fa";




export default function Search (){
  var filtered = Data.filter(function(item) { 
    return item["Name"].length <= 55;  
 });
  const [data, setData] = useState(filtered);
  const [value,setValue] = useState();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState(''); 


  const searchData = (pattern) => {
    setValue(pattern)
    if (!pattern) {
      setData(filtered);
      return;
    }

    const fuse = new Fuse(filtered, {
      keys: ["Name", "Symbol"],
    });

    const result = fuse.search(pattern);

    const matches = [];
    if (!result.length) {
      setData([]);
    } else {
      result.forEach(({item}) => {
        matches.push(item);
      });
      setData(matches);
    }
  };

  const [name, setName] = useState('');
  const [tickers, setTickers] = useState([]);
  const handleClick = (Symbol) => {
    if (tickers.indexOf(Symbol)==-1){
      setTickers([...tickers,Symbol]);
    }

  }

  const handleChange = event => {
      setAmount(event.target.value)
      console.log('value is:', event.target.value);
  }
  const handleRecommendations = async() =>{
    setMessage('');
    if (parseInt(amount)<1000){
      alert("Please enter amount greater than 1000");
    }
    if (tickers.length==0){
      alert("Please select atleast one stock");
    }
    else{
      setMessage("Please wait while recommendations are generated");
      const response_data = await fetch(`${config.baseUrl}/rl/get_recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({amount:amount,
          tickers:tickers})
      })

      const json = await response_data.json();
      window.location.href='recommendation';
    }
  }  

  return (

      <div className="stock-wrap">
        <Navbar />
        <button className="recommendations" onClick={handleRecommendations}>Get recommendations</button>
        {message}
        <h1 className="Title2">Amount to Trade </h1>
        <div className="amountbar">
        <div className="Amount">
            <span className="AmountSpan">
            <FaDollarSign />
            </span>
            <input
            className="AmountInput"
            type="number"
            min="1000"
            onChange={handleChange}
            placeholder="Enter the credits to trade"
            />
                
        </div>
        
        </div>
        <h1 className="Title" >Assets To Trade</h1>
        <div className="searchbar">
        <SearchBar
          placeholder="Enter the Stock Ticker"
          onChange={(e) => searchData(e.target.value)}
        />
        </div>
        <div className="selectedList">
        <ul>
              {tickers.map(ticker => (
                <li key={ticker}>{ticker}</li>
              ))}
        </ul>
        </div>
        
      <div className="Container">
        {data.map((item) => (
          <div className="CardWrapper">
          <div className="StockName">{item.Name}
          </div>
          
          <div className="Ticker">
            <button className="sub" onClick={() => {
              setName(item.Symbol)
              handleClick(item.Symbol)}}>ADD</button>
          </div>
        </div>
        ))}
      </div>
      </div>
  )
        };

