import Data from "./data.json";
import {useState} from "react";
import React from "react";
import Card from "./search_card";
import './stock_search.css';
import SearchBar from "./search_bar";
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
      <h1 className="Title">Search Stocks</h1>
      <div className="searchbar">
      <SearchBar
        placeholder="Enter the Stock Ticker"
        onChange={(e) => searchData(e.target.value)}
       />
       <button class="Submit" onClick={() => window.location.href = `stocks?stock=` + value}> Search </button>
      </div>
    <div className="Container">
      {data.map((item) => (
        <Card {...item} key={item.Symbol} />
      ))}
    </div>
    </div>
  )
 }

