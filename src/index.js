import React from 'react';
import ReactDOM from 'react-dom/client';
//import App from './App'
import Candlestick from './pages/candles';
import './styles.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Candlestick />
  </React.StrictMode>
);

