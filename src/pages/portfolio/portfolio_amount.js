import "./portfolio_amount.css";
import {FaDollarSign} from "react-icons/fa";
import {useState} from "react";



const Amount = ({ placeholder}) => {
    const [amount, setAmount] = useState('');
    
    const handleChange = event => {
        setAmount(event.target.value)
        console.log('value is:', event.target.value);
        }
    return (
        <div className="Amount">
            <span className="AmountSpan">
            <FaDollarSign />
            </span>
            <input
            className="AmountInput"
            type="number"
            min="1000"
            onChange={handleChange}
            placeholder={placeholder}
            />
                
        </div>   
    );
  };


export default Amount;