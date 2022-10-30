import { React, Component} from 'react';
import './nav.css';
import {MdLogout} from "react-icons/md";
import {AiOutlineArrowLeft} from "react-icons/ai"
const Navbar = () => {
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

      const dashboard_redirect =() =>{
        if(localStorage.getItem("token"))
            window.location.href = 'dashboard';
        else
            window.location.href = 'login';
      }
        return(
            <div className='nav-comp'>
                <div class="float-child"><div className='left'><span onClick={() => dashboard_redirect()}><AiOutlineArrowLeft/> Back to Dashboard</span></div></div>
                <div class="float-child"><div className='right'><span onClick={() => logout()}>Logout <MdLogout/></span></div></div>
            </div>
        )
}

export default Navbar