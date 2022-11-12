import { useState } from "react";
import "./portfolio_search.css";
let nextId = 0;
const Card = ({Name,Symbol}) => {
    const [name, setName] = useState('');
    const [tickers, setTickers] = useState([]);
    const [addbutton, setAddbutton] = useState('ADD');
    const handleClick = event => {
      if (event.currentTarget.disabled == false){
        setName('');
        setTickers([
          ...tickers,
          { id: nextId++, name: Symbol}
        ]);
        event.currentTarget.disabled = true;
        setAddbutton('ADDED')
      }
      else{
        console.log('buttonclicked');
      }

    }


    return (
      <div className="CardWrapper">
            <div className="StockName">{Name}
            <ul>
              {tickers.map(ticker => (
                <li key={ticker.id}>{ticker.name}</li>
              ))}
            </ul>
            </div>
            
            <div className="Ticker">
              <button className="sub" onClick={handleClick}>{addbutton}</button>
            </div>
        
        
      </div>
    );
  };

export default Card;