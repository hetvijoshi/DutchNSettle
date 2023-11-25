import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, TextField, Typography } from "@mui/material"
import React, { useEffect, useContext } from "react"
import { TbDecimal } from "react-icons/tb";
import { FaEquals } from "react-icons/fa";
import { FaPercentage } from "react-icons/fa";
import { FaChartBar } from "react-icons/fa6";
import { ExpenseContext } from "@/app/lib/utility/context";


const SplitOptionsSection = () => {

    const { expense, setExpense } = useContext(ExpenseContext)

    useEffect(() => {
        console.log("INITIAL", expense)
    }, [expense])

    const splitOptions = [
        {
            name: "Split equally",
            icon: <FaEquals />,
            chipText: "equally"
        },
        {
            name: "Split by exact amounts",
            icon: <TbDecimal />,
            chipText: "unequally"
        },
        {
            name: "Split by percentages",
            icon: <FaPercentage />,
            chipText: "unequally"
        },
        {
            name: "Split by shares",
            icon: <FaChartBar />,
            chipText: "unequally"
        },
    ]

    const handleSplitOption = (option) => {
        setExpense({ ...expense, selectedOption: option })
    }

    const handleChange = (event) => {
        const filteredSplitMembers = expense?.members?.map(member => {
            if (member.name == event.target.name) {
                member["checked"] = !member.checked
                return { ...member }
            }
            else {
                return { ...member }
            }
        })
        console.log("FILTERED", filteredSplitMembers)
        setExpense({ ...expense, members: filteredSplitMembers })
    };


    return (
        <>
            <Box display={"flex"} justifyContent={"center"} marginTop={3}>
                {splitOptions.map((option, index) => (
                    <Button key={"s" + index} onClick={() => handleSplitOption(option)}>{option.icon}</Button>
                ))}
            </Box>
            <Box display={"flex"} justifyContent={"start"} marginTop={3}>
                {(expense?.selectedOption && expense?.selectedOption?.name) && <Typography variant="h5">{expense?.selectedOption?.name}</Typography>}
            </Box>
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                <Box display={"flex"}>
                    <FormGroup>
                        <div>
                            {expense?.members?.map((member, index) => (
                                <FormControlLabel
                                    key={"m" + index}
                                    control={
                                        <Checkbox checked={member.checked} onChange={handleChange} name={member.name} />
                                    }
                                    label={member.name}
                                />
                            ))}
                        </div>
                        <div>
                            <TextField variant="standard" />
                        </div>
                    </FormGroup>
                </Box>
            </FormControl>
        </>
    )
}

export default SplitOptionsSection