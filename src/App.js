import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/homepage";
import Form from "./pages/login/form";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={ <HomePage />}/>
        <Route path='/login' element={ <Form />}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;