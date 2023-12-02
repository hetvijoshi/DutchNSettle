import React, { useContext, useEffect } from "react";
import { ExpenseContext } from "@/app/lib/utility/context";
import { Box, FormControl, FormGroup, FormControlLabel, Checkbox, TextField, Typography } from "@mui/material";


const SplitEqually = () => {

    const { expense, setExpense } = useContext(ExpenseContext)

    useEffect(() => {
        const totalChecked = expense.members.filter(m => { return m.checked }).length;
        const shareMembers = expense.members.map(member => {
            if (member.checked) {
                return { ...member, share: expense.amount / totalChecked }
            } else {
                return { ...member }
            }
        })
        setExpense({ ...expense, members: shareMembers })
    }, [expense.amount])

    const handleChange = (event) => {
        const filteredSplitMembers = expense?.members?.map(member => {
            if (member._id == event.target.name) {
                member["checked"] = !member.checked
                member["share"] = ""
                return { ...member }
            }
            else {
                return { ...member }
            }
        })
        const totalChecked = filteredSplitMembers.filter(m => { return m.checked }).length;
        const shareMembers = filteredSplitMembers.map(member => {
            if (member.checked) {
                return { ...member, share: expense.amount / totalChecked }
            } else {
                return { ...member }
            }
        })
        setExpense({ ...expense, members: shareMembers })
    };

    return (
        <>
            <Box display={"flex"} justifyContent={"start"} marginTop={3}>
                {(expense?.selectedOption && expense?.selectedOption?.name) && <Typography variant="h5">{expense?.selectedOption?.name}</Typography>}
            </Box>
            <Box>
                <FormControl sx={{ m: 3, display: "flex" }} component="fieldset" variant="standard">
                    <FormGroup>
                        {expense?.members?.map((member, index) => (
                            <Box key={"m" + index} display={"flex"} justifyContent={"space-between"} width={"80%"}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={member.checked} onChange={handleChange} name={member._id} />
                                    }
                                    label={member.name}
                                />
                                <div>
                                    <TextField variant="standard" type="number" name={member._id} value={member.share} disabled />
                                </div>
                            </Box>
                        ))}
                    </FormGroup>
                </FormControl>
            </Box>
        </>
    )
}

export default SplitEqually