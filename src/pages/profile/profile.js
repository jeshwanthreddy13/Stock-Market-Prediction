import React from 'react';
import Navbar from '../navbar/nav';
import "./profile.css"
import {AiOutlineUser} from 'react-icons/ai';
import { useEffect } from 'react';
import config from '../../config';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import validator from "validator";

const Profile = () => {

    const [user,setUser] = useState({})
    const [stock,setStock] = useState([])

    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [phone,setPhone] = useState("")
    const [pass,setPassword] = useState("")
    const [message,setMessage] = useState("")

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setMessage("")
        setShow(false);
    }
    const handleShow = () => setShow(true);
    
    const handleSave = () => {
        const phoneCheck = new RegExp(('[6789][0-9]{9}'))
        setMessage("")
        var k = 0;
        if (email !== "" && email.val !== "" && !validator.isEmail(email.val)){
                    setMessage("Invalid Email!")
                    k=1; 
        }
        else if(phone !== "" && !phoneCheck.test(phone.val) && (phone.val !== "") ){

            setMessage("Invalid Phone Number!")
            k = 1;
        }
        else if(pass !== "" && pass.val !== "" && pass.val.length<6){
            setMessage("Password needs atleast 6 characters!")
            k = 1;
        }
        if (k === 0){
            fetch(`${config.baseUrl}/profile/edit_profile`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "auth-token": localStorage.getItem("token")
                },
                body: JSON.stringify({"name": name.val,
                "email": email.val,
                "phone": phone.val,
                "password": pass.val})
              })
              .then((res) => res.json())
             .then(({ message }) => {
                    if(message === "success"){
                        setMessage("")
                        setShow(false);
                        window.location.reload(true);
                    }
                    else{
                        setMessage("Server Error. Try Again!")
                    }
                })
        }
    }

    useEffect( () => {
        fetch(`${config.baseUrl}/profile/user_details`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
          })
            .then((res) => res.json())
            .then(({ error, data }) => {
                setUser(data.user)
                setStock(data.stocks)
              })
    }, [])

    return(
        <>
            <Navbar />
            <div className="profile-wrapper">
                <div className='profile-container con1'>
                    <div className='p-icon'><AiOutlineUser/></div>
                    <div className='p-data'>
                        <p>My Profile</p>
                        <div className='p-name'>
                            <div className='container-1'> {user.name} </div>
                            <div className='container-2'> {user.phone} </div>
                        </div>
                        <div className='p-email'> {user.email} </div>
                        <button className="button-18" onClick={handleShow}>Edit Details</button>
                    </div>
                </div>
                <div className='profile-container'>
                    <div className='container-top'>
                        <p>Your Virtual Credits</p>
                        <div className='d-info'>Current Credits Available: {user.credits}</div>
                        <div className='d-info'>Total Amount of Credits Invested: {stock.total}</div>
                        <div className='d-info'>Number of Stocks Owned: {stock.no}</div>
                        <button className="button-19"><a href = "owned_stock">Owned Stocks</a></button>
                        <button className="button-19"><a href = "transactions">Show Transactions</a></button>
                    </div>
                    <div className='container-bottom'>
                        <p>Trade Recommendations</p>
                        <div className='cb1'>
                            <div className='cb-data'>
                                <p>Stock Trends</p>
                                <p className='cb-desc'>Bollinger Bands and Support & Resistance Bands to see how trends progress</p>
                            </div>
                            <div className='cb-button'>
                                <div className='center'>
                                <button className="button-cb"><a href = "trends">Stock Trends</a></button>
                                </div>
                            </div>
                        </div>
                        <div className='cb1'>
                            <div className='cb-data'>
                                <p>Optimized Portfolio</p>
                                <p className='cb-desc'>Get smart recommendations on how to invest your credits!</p>
                            </div>
                            <div className='cb-button'>
                                <div className='center'>
                                <button className="button-cb"><a href = "portfolio">Portfolio</a></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="modal-error">{message}</p>
                    <p>Enter details in field you want to change</p>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your Name"
                        autoFocus
                        onChange={e => {setName({ val: e.target.value })}}
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your Email"
                        onChange={e => {setEmail({ val: e.target.value })}}
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your Phone Number"
                        onChange={e => {setPhone({ val: e.target.value })}}
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your Password"
                        onChange={e => {setPassword({ val: e.target.value })}}
                    />
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="light" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={handleSave}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Profile