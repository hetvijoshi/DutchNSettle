import React, { useContext } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Box, Chip } from "@mui/material";
import { ExpenseContext } from "@/app/lib/utility/context";

export default function AutoComplete({ handleChange, errors }) {

    const [input, setInput] = useState("");

    const { expense, setExpense } = useContext(ExpenseContext)

    const inputChange = (value) => {
        setInput(value);
        handleChange(value);
    };

    const handleAutocomplete = (array) => {
        setExpense({ ...expense, results: [] })
        const members = [expense.loggedInMember, ...array]
        let uniqueValues = [...new Map(members.map(item => [item._id, item])).values()]
        uniqueValues = uniqueValues.map(member => { return { ...member, checked: true } });
        setExpense({ ...expense, members: uniqueValues })
    }

    return (
        <Box gap={2} sx={{ width: 300 }}>
            {expense.results?.length >= 0 && <Autocomplete
                disabled={expense.isGroup ? true : false}
                defaultValue={expense.isGroup ? [{ name: expense.groupName }] : []}
                multiple
                id="tags-standard"
                options={expense.results}
                getOptionLabel={(option) => option?.name}
                onChange={(event, value) => handleAutocomplete(value)}
                renderOption={(props, option) => {
                    return (
                        <li {...props} key={option?._id}>
                            {option?.name}
                        </li>
                    )
                }}
                renderTags={(tagValue, getTagProps) => {
                    tagValue = [...new Map(tagValue.map(item => [item._id, item])).values()]
                    return tagValue.map((option, index) => {
                        return (<Chip {...getTagProps({ index })} key={index} label={option.name} />)
                    })
                }}

                renderInput={(params) => (
                    <TextField
                        error={errors ? true : false}
                        {...params}
                        variant="standard"
                        onChange={(e) => { inputChange(e.target.value) }}
                        value={input}
                        helperText={errors}
                    />
                )}
            />}
        </Box>
    );
}
