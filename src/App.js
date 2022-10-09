import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import HomePage from "./pages/landing/homepage";
import Dashboard from './pages/dashboard/dashboard';
import NotFound from './pages/notFound';
import Signup from './pages/login/signup';
import Login from './pages/login/login';
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route exact path='/' element={ <HomePage />}/>
        <Route exact path='/login' element={ <Login />}/>
        <Route path="/dashboard" element={localStorage.getItem("token") ? (<Dashboard />) : (<Navigate replace to={"/login"} />)} />
        <Route exact path='/register' element={ <Signup />}/>
        <Route exact path = "*" element={<NotFound />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;