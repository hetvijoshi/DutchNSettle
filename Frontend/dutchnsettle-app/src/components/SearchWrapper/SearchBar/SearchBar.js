import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

import classes from "./SearchBar.module.scss"

export const SearchBar = ({ handleChange, onBlur, inputValue }) => {
    const [input, setInput] = useState("");

    const inputChange = (value) => {
        setInput(value);
        handleChange(value);
    };

    return (
        <div className={classes.input_wrapper}>
            <FaSearch id="search-icon" />
            <input
                placeholder="Type to search..."
                value={inputValue ? inputValue : input}
                onChange={(e) => inputChange(e.target.value)}
                className={classes.input}
                onBlur={onBlur}
            />
        </div>
    );
};