import Data from "./data.json";
import {useState} from "react";
import React from "react";
import Card from "./search_card";
import './stock_search.css';
import SearchBar from "./search_bar";
import Fuse from "fuse.js";
import Navbar from "../navbar/nav";

export default function Search (){
  const [data, setData] = useState(Data);
  const [value,setValue] = useState();

  const searchData = (pattern) => {
    setValue(pattern)
    if (!pattern) {
      setData(Data);
      return;
    }

    const fuse = new Fuse(Data, {
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
    <div>
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

