import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Fullpage from "./pages/carousel";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={ <Fullpage />}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;