import React, { useEffect, useState } from "react";
import "./dashboard.css"
import config from "../../config";
import { FaUserCircle } from "react-icons/fa";
import {AiFillHome} from "react-icons/ai";
import {RiStockFill} from "react-icons/ri"; 
import {MdPriceChange} from "react-icons/md";
import {ImProfile} from "react-icons/im";
import {MdLogout} from "react-icons/md";
import {FcMoneyTransfer} from "react-icons/fc";
import {HiTrendingUp} from "react-icons/hi";
import Chart from "react-apexcharts";
import "semantic-ui-css/semantic.min.css";
import { NEWS_API_KEY } from "../../config";
import { List } from "semantic-ui-react";

const data = {
          
  series: [{
      name: "Credits Owned",
      data: [10000,10200,10500,9800,9600,8400,9300,8800,10100,10900]
  }],
  options: {
    chart: {
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    colors: ["#8e0e00"],
    title: {
      text: 'Credits Owned in The Past 10 Weeks',
      align: 'center'
    },
    grid: {
      row: {
        colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    xaxis: {
      categories: ['Week1', 'Week2','Week3','Week4','Week5','Week6','Week7','Week8','Week9','Week10'],
    }
  },


};

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [state, setState] = useState(null);
  const [stock, setStock] = useState({stock : []});
  const logout = () => {
    /* eslint-disable */
    const toLogout = confirm("Are you sure you want to logout ?");
    /* eslint-enable */
    if (toLogout) {
      localStorage.clear();
      setTimeout(function(){
        window.location.href = 'login';
     }, 1000);
    }
  };

  useEffect(() => {
    fetch(`${config.baseUrl}/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then(({ error, data }) => {
        setDashboard(data);
      })
  }, []);

  const GetArticles = async () => {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=stocks&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
      );
      const json = await response.json();
      return json
  };

  useEffect(() => {
    async function a(){
      try {
      const response = await GetArticles();
      setState({ articles: response.articles });
    } catch (error) {
      setState({ apiError: "Could not find any articles" });
    }
  }
  a();
  }, []);

  useEffect(() => {
    fetch(`${config.baseUrl}/stocks/owned_stocks`, {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    })
      .then((res) => (res.json()))
      .then(({ error, data }) => {
        setStock(data);
      })
    }
  , []);

  return (
    <div className="d-wrapper">
      <div className="navbar">
        <p className="n-text"> Hello <b>{dashboard?.user?.name}</b>, Welcome Back!</p>
        <a className="nav" href="/"><FcMoneyTransfer size="30px"/>&nbsp;&nbsp;10,000</a>
      </div>
      <div className="row-1">
        <div className="element credits-chart">
          <Chart options={data.options} series={data.series} type="line" height={"100%"} width={"100%"}/>
        </div>
        <div className="element news">
          <h3>Top News in Stocks! </h3>
          <List>
          <ol>
            {state?.articles.slice(0,10).map((article,index) => (
              <li class=""><List.Item key={article.title + index}><a href={article.url} target="_blank" rel="noreferrer">{article.title}</a></List.Item></li>
          ))}
          </ol>
        </List>
        </div>
      </div>
      <div className="stocks-owned">
        <div className="table-title"><h2> Stocks You Own </h2><button><a href = "owned_stock">Click to view all stocks</a></button></div>
        <div className="s-table">
        <table>
          <tr>
            <th>Name</th>
            <th>Credits Invested</th>
            <th>Stock Units</th>
          </tr>
          {stock.stock.slice(0,4).map((val, key) => {
            return (
              <tr key={key}>
                <td>{val.stock_name}</td>
                <td>{val.credits_invested}</td>
                <td>{val.stock_units}</td>
              </tr>
            )
          })}
        </table>
        </div>
      </div>
      <div className = "sidebar">
        <p className="s-text"><div className="s-icon"><FaUserCircle /></div><br/><div className="s-name">{dashboard?.user?.name}</div></p>
        <div className="s-links">
          <a href="/dashboard"><div className="s-link"><div className="sl-icon"><AiFillHome/></div>Dashboard</div></a>
          <a href="/search"><div className="s-link"><div className="sl-icon"><RiStockFill/></div>Stocks</div></a>
          <a href="/predictions"><div className="s-link"><div className="sl-icon"><MdPriceChange/></div>Price Predictions</div></a>
          <a href="/trends"><div className="s-link"><div className="sl-icon"><HiTrendingUp/></div>Trends</div></a>
          <a href="/profile"><div className="s-link"><div className="sl-icon"><ImProfile/></div>Profile</div></a>
        </div>
        <div className="s-logout"><span
                onClick={() => logout()}
              >
                Logout <MdLogout/>
              </span></div>
      </div>
    </div>
  );
};

export default Dashboard;