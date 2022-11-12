import Data from "./portfolio_data.json";
import {useState} from "react";
import React from "react";
import Card from "./portfolio_search_card";
import './portfolio_stock_search.css';
import SearchBar from "./portfolio_search_bar";
import Amount from "./portfolio_amount";
import Fuse from "fuse.js";
import Navbar from "../navbar/nav";

export default function Search (){
  var filtered = Data.filter(function(item) { 
    return item["Name"].length <= 55;  
 });
  const [data, setData] = useState(filtered);
  const [value,setValue] = useState();

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
  

      

  return (

      <div className="stock-wrap">
        <Navbar />
        <h1 className="Title2">Amount to Trade </h1>
        <div className="amountbar">
        <Amount placeholder="Enter the amount to trade min:1000"  
        />
        
        </div>
        <h1 className="Title" >Assets To Trade</h1>
        <div className="searchbar">
        <SearchBar
          placeholder="Enter the Stock Ticker"
          onChange={(e) => searchData(e.target.value)}
        />
        </div>
      <div className="Container">
        {data.map((item) => (
          <Card {...item} key={item.Symbol} />
        ))}
      </div>
      </div>
  )
        };

