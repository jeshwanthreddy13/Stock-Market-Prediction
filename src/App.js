import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/landing/homepage";
import Form from "./pages/login/form";
import Dashboard from './pages/dashboard/dashboard';
import NotFound from './pages/notFound';
import SignUp from './pages/login/signup';
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route exact path='/' element={ <HomePage />}/>
        <Route exact path='/login' element={ <Form />}/>
        <Route exact path='/dashboard' element={ <Dashboard />}/>
        <Route exact path='/signup' element={ <SignUp />}/>
        <Route exact path = "*" element={<NotFound />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;