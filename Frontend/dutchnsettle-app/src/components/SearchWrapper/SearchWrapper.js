import React from "react"
import { SearchBar } from "./SearchBar/SearchBar"
import { SearchResultsList } from "./SearchResultList/SearchResultList"
import PropTypes from "prop-types";



const SearchWrapper = ({ handleChange, results, handleClick, onBlur, inputValue }) => {
    return (
        <div >
            <SearchBar handleChange={handleChange} onBlur={onBlur} inputValue={inputValue} />
            {results && results.length > 0 && <SearchResultsList results={results} handleClick={handleClick} />}
        </div>
    )
}

SearchWrapper.propTypes={
    inputValue: PropTypes.string
}

export default SearchWrapper