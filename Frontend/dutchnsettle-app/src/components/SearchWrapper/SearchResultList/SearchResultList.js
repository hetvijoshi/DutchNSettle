import classes from "./SearchResultList.module.scss";
import React from "react";

export const SearchResultsList = ({ results, handleClick }) => {
    return (
        <div className={classes.results_list}>
            {results.map((result, id) => {
                return <div
                    key={id}
                    className={classes.search_result}
                    onClick={() => handleClick(result)}
                >
                    {result?.displayItem}
                </div>;
            })}
        </div>
    );
};