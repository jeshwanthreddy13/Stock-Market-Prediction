import React, { useState, useEffect } from "react";
import Navbar from "../navbar/nav";
import config from "../../config";
import './transaction.css'
const Transactions = () => {
    const [transactions, setTransactions] = useState([])

    useEffect( () => {
        fetch(`${config.baseUrl}/stocks/get_transactions`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
          })
            .then((res) => res.json())
            .then(({ transactions }) => {
                setTransactions(transactions)
              })
    }, [])

    return(
        <>
            <Navbar/>
            <h1 className="trans-head">Transactions</h1>
            <table className="transaction-table">
              <thead>
              <tr>
                <th>Action</th>
                <th>Stock Name</th>
                <th>Stock Units</th>
                <th>Credits</th>
                <th>Date</th>
              </tr>
              </thead>
              <tbody>
              {transactions.map((val) => {
                return (
                  <tr key={val.date} className={val.method}>
                    <td>{val.method.toUpperCase()}</td>
                    <td>{val.stock_name.toUpperCase()}</td>
                    <td>{val.stock_units}</td>
                    <td>{val.credits_invested}</td>
                    <td>{val.date.toLocaleString()}</td>
                  </tr>
                )
              })}
              </tbody>
            </table>
        </>
    )
}

export default Transactions;