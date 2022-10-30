import "./search.css";

const Card = ({Name,Symbol}) => {
    return (
      <div className="CardWrapper">
        <div className="ColDetail">
          <div className="Header">
            <div className="StockName">{Name}</div>
          </div>
          <div className="Ticker">{Symbol}</div>
        </div>
      </div>
    );
  };

export default Card;