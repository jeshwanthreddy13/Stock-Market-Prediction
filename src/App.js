import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing';
import About from "./pages/about";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={ <LandingPage />}/>
        <Route path='/about' element={ <About />}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;