import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import HomePage from "./pages/landing/homepage";
import Dashboard from './pages/dashboard/dashboard';
import Signup from './pages/login/signup';
import Login from './pages/login/login';
import Stock from './pages/stock';
import Search from "./pages/stock-search/stock_search";
import Navbar from './pages/navbar/nav';
import OwnedStock from './pages/owned-stock/owned-stock';
import Profile from './pages/profile/profile';
import Predictions from './pages/predictions/prediction';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route exact path='/' element={ <HomePage />}/>
        <Route exact path='/login' element={ <Login />}/>
        <Route path="/dashboard" element={localStorage.getItem("token") ? (<Dashboard />) : (<Navigate replace to={"/login"} />)} />
        <Route exact path='/register' element={ <Signup />}/>
        <Route exact path='/stocks' element={ <Stock />}/>
        <Route exact path='/search' element={ <Search />}/>
        <Route exact path='/nav' element={ <Navbar />}/>
        <Route path='/owned_stock' element={ <OwnedStock />}/>
        <Route path='/profile' element={ <Profile />}/>
        <Route path='/predictions' element= { <Predictions/> } />
        <Route exact path = "*" element={localStorage.getItem("token") ? (<Dashboard />) : (<Navigate replace to={"/login"} />)} />
      </Routes>
    </Router>
    </>
  );
}

export default App;