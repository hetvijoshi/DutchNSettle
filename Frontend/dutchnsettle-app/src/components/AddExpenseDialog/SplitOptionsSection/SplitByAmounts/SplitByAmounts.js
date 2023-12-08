import React, { useContext, useState, useEffect } from "react";
import { ExpenseContext } from "@/app/lib/utility/context";
import { Box, FormControl, FormGroup, FormControlLabel, Checkbox, TextField, Typography } from "@mui/material";


const SplitByAmounts = () => {

    const [errors, setErrors] = useState({ membersShareSum: "" })

    const { expense, setExpense } = useContext(ExpenseContext)

    useEffect(() => {
        const totalChecked = expense.members.filter(m => { return m.checked }).length;
        const shareMembers = expense.members.map(member => {
            if (member.checked) {
                return { ...member, share: parseFloat((expense.amount / totalChecked).toFixed(2)) }
            } else {
                return { ...member }
            }
        })
        console.log(shareMembers)
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
        setExpense({ ...expense, members: filteredSplitMembers })
    };

    const handleShares = (event) => {
        let err = { ...errors };
        err.membersShareSum = ""
        setErrors(err)
        const filteredSplitMembers = expense?.members?.map(member => {
            if (member._id == event.target.name) {
                member["share"] = event.target.value
                return { ...member }
            }
            else {
                return { ...member }
            }
        })
        setExpense({ ...expense, members: filteredSplitMembers })
        const sum = expense.members.reduce((a, b) => a + (Number(b["share"]) || 0), 0)
        if (sum != expense.amount) {
            let err = { ...errors };
            err.membersShareSum = "Share amounts doesn't sum up with the expense amount"
            setErrors(err)
        }
    }


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
                                    <TextField variant="standard" type="number" onChange={handleShares} name={member._id} value={member.share} />
                                </div>
                            </Box>
                        ))}
                        <Typography variant="caption" color={"red"} >{errors.membersShareSum}</Typography>
                    </FormGroup>
                </FormControl>
            </Box>
        </>
    )
}

export default SplitByAmounts