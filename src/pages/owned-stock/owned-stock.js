import React, { useEffect, useState } from "react";
import Navbar from '../navbar/nav';
import config from "../../config";
import "./owned.css"


const OwnedStock = () => {
  const [dashboard, setDashboard] = useState({stock : []});

    useEffect(() => {
      const queryParams = new URLSearchParams(window.location.search);
      const id = (queryParams.get('id'))
      console.log(id)
      fetch(`${config.baseUrl}/stocks/owned_stocks`, {
        method: "GET",
        headers: {
          "id": id,
        },
      })
        .then((res) => (res.json()))
        .then(({ error, data }) => {
          setDashboard(data);
        })
      }
    , []);
    return (
        <>
            <Navbar /> 
            <h2>Owned Stocks</h2>
            <table className="owned-table">
              <thead>
              <tr>
                <th>Name</th>
                <th>Credits Invested</th>
                <th>Stock Units</th>
              </tr>
              </thead>
              <tbody>
              {dashboard.stock.map((val, key) => {
                return (
                  <tr key={key}>
                    <td>{val.stock_name}</td>
                    <td>{val.credits_invested}</td>
                    <td>{val.stock_units}</td>
                  </tr>
                )
              })}
              </tbody>
            </table>
        </>
    );
  };
  
  export default OwnedStock;