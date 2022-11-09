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
    const [credits, setCredits] = useState(0)
    const [units, setUnits] = useState(0)
    const [message,setMessage] = useState("")
    const [email,setEmail] = useState("")

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
          .then(({price, credits, email}) => {
            setPrice(price)
            setCredits(credits)
            setEmail(email)
          })
      }, []);

      const [show, setShow] = useState(false);
      const handleClose = () => {
        setShow(false);
        setMessage("")
      }
      const handleShow = () => setShow(true);

      const handleSave = async () => {
        const data_units = parseFloat(units.val)
        if(units.val === "" || units === 0 || units.val === 0){
          setMessage("Enter value greater than 0")
        }
        else if(!(Number.isInteger(data_units))){
          setMessage("Please enter a Integer")
        }
        else{
          setMessage("")
          const total = data_units * price
          if(total > credits){
            setMessage("You dont have enough credits for this trade!")
          }
          else{
            const response_data = await fetch(`${config.baseUrl}/stocks/buy_stock`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
              },
              body: JSON.stringify({
                "email": email,
                "name": queryParams.get('stock'),
                "credits": total,
                "units": data_units
              })
            })
            .then(handleClose())
          }
        }
      }

    return (
        <>
            <Navbar /> 
            <h2>Data for {queryParams.get('stock').toUpperCase()} Stocks</h2>
            <div className="candle-chart"><Chart options={options} series={options.series} type="candlestick" height={"100%"} width={"100%"} /></div>
            <button className='buy-stocks' onClick={handleShow}> Buy </button>
            <Modal show={show} onHide={handleClose} backdrop="static">
              <Modal.Header closeButton>
                <Modal.Title>Buy Stocks</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <h4>How many units of {queryParams.get('stock').toUpperCase()} do you want to?</h4>
                  <h5>Current Price: {price}</h5>
                  <h5>Your Available Credits: {credits}</h5>
                  <h5 className='note'>Note: An additional fee of 20 credits + 0.5% of trade value is deducted.</h5>
                  <p className="modal-error">{message}</p>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Control
                        type="number"
                        placeholder="Enter number of units"
                        step="1"
                        onChange={e => {setUnits({ val: e.target.value })}}
                    />
                    </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="danger" onClick={handleSave}>
                  Buy Stocks
                </Button>
              </Modal.Footer>
            </Modal>
        </>
    );
  };
  
  export default Stock;