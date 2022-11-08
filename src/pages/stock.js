import React, {useState, useEffect} from 'react';
import config from "../config";
import Chart from "react-apexcharts";
import "./stock.css"
import Navbar from './navbar/nav';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const Stock = () => {

    const [stock, setStock] = useState({data: []});
    const [price, setPrice] = useState(0)

    var stock_array = []
    const queryParams = new URLSearchParams(window.location.search);
    const GetStocks = async () => {
        const stock_name = (queryParams.get('stock'))
        const response = await fetch(
            `${config.baseUrl}/stocks/?stock=${stock_name}`, {
              method: "GET",
              headers: {
                "auth-token": localStorage.getItem("token"),
              }}
        );
        const json = await response.json();
        return json
    };
  
    useEffect(() => {
      async function a(){
        try {
        const response = await GetStocks();
        stock_array = []
        response.map((data) => {
            var temp = [data.Date,data.Open, data.High, data.Low, data.Close]
            stock_array.push(temp)
        })
        setStock({data: stock_array})
      } catch (error) {
        setStock({ apiError: error });
      }
    }
    a();
    }, []);

    var options = {
        series: [{
        data: stock.data
      }],
        chart: {
        type: 'candlestick',
        height: 350
      },
      title: {
        text: 'CandleStick Chart',
        align: 'left'
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
      };

      useEffect(() => {
        fetch(`${config.baseUrl}/stocks/get_price`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
            "ticker": queryParams.get('stock')
          },
        })
          .then((res) => res.json())
          .then(({price}) => {
            setPrice(price)
          })
      }, []);

      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);



    return (
        <>
            <Navbar /> 
            <h2>Data for {queryParams.get('stock')} Stocks</h2>
            <div className="candle-chart"><Chart options={options} series={options.series} type="candlestick" height={"100%"} width={"100%"} /></div>
            <button className='buy-stocks' onClick={handleShow}> Buy </button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Buy Stocks</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <h4>How many units of {queryParams.get('stock')} do you wanna buy?</h4>
                  <h5>Current Price: {price}</h5>
                  
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="danger" onClick={handleClose}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
        </>
    );
  };
  
  export default Stock;