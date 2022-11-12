import './portfolio_search_bar.css'
import {FaSearch} from "react-icons/fa";

const SearchBar = ({onChange, placeholder, onSubmit}) => {
    return (
      <div className="Search">
        <span className="SearchSpan">
          <FaSearch />
        </span>
        <input
          className="SearchInput"
          type="text"
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    );
  };

export default SearchBar;