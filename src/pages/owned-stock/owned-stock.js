import React, { useEffect, useState } from "react";
import Navbar from '../navbar/nav';
import config from "../../config";
import "./owned.css"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const OwnedStock = () => {
  const [dashboard, setDashboard] = useState({stock : []});
  const [name, setName] = useState("");
  const [units, setUnits] = useState(0);
  const [message, setMessage] = useState("");
  const [sell,setSell] = useState(0);
  const [show, setShow] = useState(false);
  const [price,setPrice] = useState(0);
  const [email, setEmail] = useState("");

    useEffect(() => {
      fetch(`${config.baseUrl}/stocks/owned_stocks`, {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      })
        .then((res) => (res.json()))
        .then(({ error, data }) => {
          setDashboard(data);
        })
      }
    , []);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getPrice = (s_name) =>{
      fetch(`${config.baseUrl}/stocks/get_price`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
          "ticker": s_name
        },
      })
        .then((res) => res.json())
        .then(({price, credits, email}) => {
          setPrice(price)
          setEmail(email)
        })
    }

    const handleSell = async () => {
      const data_units = parseFloat(sell.val)
      if(units.val === "" || units === 0 || units.val === 0){
        setMessage("Enter value greater than 0")
      }
      else if(!(Number.isInteger(data_units))){
        setMessage("Please enter a Integer")
      }
      else if(data_units > units){
        setMessage("You do not have these many units to sell")
      }
      else{
        setMessage("")
        const total = price * data_units
        const response_data = await fetch(`${config.baseUrl}/stocks/sell_stock`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            "email": email,
            "name": name,
            "credits": total,
            "number": data_units
          })
        })
        .then(handleClose())
        .then(window.location.reload(true))
      }
    }

    return (
        <>
            <div className="os-wrapper">
            <Navbar /> 
            <h2>Owned Stocks</h2>
            <table className="owned-table">
              <thead>
              <tr>
                <th>Name</th>
                <th>Credits Invested</th>
                <th>Stock Units</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {dashboard.stock.map((val, key) => {
                return (
                  <tr key={key}>
                    <td>{val.stock_name.toUpperCase()}</td>
                    <td>{val.credits_invested}</td>
                    <td>{val.stock_units}</td>
                    <td><button className="sell-button" onClick={() => {
                      setName(val.stock_name)
                      setUnits(val.stock_units)
                      getPrice(val.stock_name)
                      handleShow()
                    }}>Sell</button></td>
                  </tr>
                )
              })}
              </tbody>
            </table>
            </div>
            <Modal show={show} onHide={handleClose} backdrop="static">
              <Modal.Header closeButton>
                <Modal.Title>Sell Stocks</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <h4>How many units of {name} do you want to sell?</h4>
                  <h5>Number of Stocks Available: {units}</h5>
                  <h5>Current Price: {price}</h5>
                  <h5 className='note'>Note: An additional fee of 20 credits + 0.5% of trade value is deducted.</h5>
                  <p className="modal-error">{message}</p>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Control
                        type="number"
                        placeholder="Enter number of units"
                        onChange={e => {setSell({ val: e.target.value })}}
                    />
                    </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="danger" onClick={handleSell}>
                  Sell Stocks
                </Button>
              </Modal.Footer>
            </Modal>
        </>
    );
  };
  
  export default OwnedStock;