import {React} from 'react';
import './nav.css';

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

      const page_redirect =(page) =>{
        if(localStorage.getItem("token"))
            window.location.href = page;
        else
            window.location.href = 'login';
      }
        return(
            <div className='nav-comp'>
                <div><span onClick={() => page_redirect("dashboard")}>Dashboard</span></div>
                <div><span onClick={() => page_redirect("profile")}>Profile</span></div>
                <div><span onClick={() => page_redirect("search")}>Stock Trading</span></div>
                <div><span onClick={() => page_redirect("predictions")}>Predictions</span></div>
                <div><span onClick={() => logout()}>Logout</span></div>
            </div>
        )
}

export default Navbar