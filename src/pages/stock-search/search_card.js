import "./search.css";

const Card = ({Name,Symbol}) => {
    return (
      <div className="CardWrapper">
            <div className="StockName">{Name}</div>
            <div className="Ticker"><div className="sub">{Symbol}</div></div>
      </div>
    );
  };

export default Card;