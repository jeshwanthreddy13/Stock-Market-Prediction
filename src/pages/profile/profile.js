import React from 'react';
import Navbar from '../navbar/nav';
import "./profile.css"
import {AiOutlineUser} from 'react-icons/ai';

const Profile = () => {
    return(
        <>
            <Navbar />
            <div className="profile-wrapper">
                <div className='profile-container con1'>
                    <div className='p-icon'><AiOutlineUser/></div>
                    <div className='p-data'>
                        <p>My Profile</p>
                        <div className='p-name'>
                            <div className='container-1'> Srinidhi </div>
                            <div className='container-2'> 7795676460 </div>
                        </div>
                        <div className='p-email'>srinidhi131@gmail.com</div>
                        <button className="button-18"><a href = "edit-profile">Edit Details</a></button>
                    </div>
                </div>
                <div className='profile-container'>
                    <div className='container-top'>
                        <p>Your Virtual Credits</p>
                        <div className='d-info'>Current Credits Available: 9467</div>
                        <div className='d-info'>Total Amount of Credits Invested: 500</div>
                        <div className='d-info'>Number of Stocks Owned: 2</div>
                        <button className="button-19"><a href = "owned_stock">Owned Stocks</a></button>
                    </div>
                    <div className='container-bottom'>
                        <p>Trade Recommendations</p>
                        <div className='d-info'>Recommendation 1</div>
                        <div className='d-info'>Recommendation 2</div>
                        <div className='d-info'>Recommendation 3</div>
                        <button className="button-19"><a href = "portfolio">Optimized Portfolio</a></button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile