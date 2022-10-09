import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css"
import config from "../../config";
import { FaUserCircle } from "react-icons/fa";
import {AiFillHome} from "react-icons/ai";
import {RiStockFill} from "react-icons/ri"; 
import {MdPriceChange} from "react-icons/md";
import {ImProfile} from "react-icons/im";
import {MdLogout} from "react-icons/md";
import {FcMoneyTransfer} from "react-icons/fc";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const history = useNavigate();

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
      });
  }, []);

  return (
    <div className="d-wrapper">
      <div className="navbar">
        <p className="n-text"> Hello <b>{dashboard?.user?.name}</b>, Welcome Back!</p>
        <a className="nav" href="/"><FcMoneyTransfer size="30px"/>&nbsp;&nbsp;10,000</a>
      </div>
      <div className = "sidebar">
        <p className="s-text"><div className="s-icon"><FaUserCircle /></div><br/><div className="s-name">{dashboard?.user?.name}</div></p>
        <div className="s-links">
          <a href="/dashboard"><div className="s-link"><div className="sl-icon"><AiFillHome/></div>Dashboard</div></a>
          <a href="/stocks"><div className="s-link"><div className="sl-icon"><RiStockFill/></div>Stocks</div></a>
          <a href="/predictions"><div className="s-link"><div className="sl-icon"><MdPriceChange/></div>Price Predictions</div></a>
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