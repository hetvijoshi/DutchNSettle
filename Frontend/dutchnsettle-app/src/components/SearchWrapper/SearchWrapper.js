import React from "react"
import { SearchBar } from "./SearchBar/SearchBar"
import { SearchResultsList } from "./SearchResultList/SearchResultList"

const SearchWrapper = ({ handleChange, results, handleClick, onBlur }) => {
    return (
        <div >
            <SearchBar handleChange={handleChange} onBlur={onBlur} />
            {results && results.length > 0 && <SearchResultsList results={results} handleClick={handleClick} />}
        </div>
    )
}

export default SearchWrapper