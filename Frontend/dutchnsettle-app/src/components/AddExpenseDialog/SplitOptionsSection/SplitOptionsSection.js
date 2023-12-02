import { Box, ToggleButtonGroup, ToggleButton } from "@mui/material"
import React, { useContext, useEffect } from "react"
import { ExpenseContext } from "@/app/lib/utility/context";
import SplitEqually from "./SplitEqually/SplitEqually"
import SplitByAmounts from "./SplitByAmounts/SplitByAmounts"
import SplitByPercent from "./SplitByPercent/SplitByPercent"
import SplitByShares from "./SplitByShares/SplitByShares"


const SplitOptionsSection = () => {

    const { expense, setExpense } = useContext(ExpenseContext)

    const handleSplitOption = (e, option) => {
        setExpense({ ...expense, selectedOption: option })
    }

    const renderSwitch = (type) => {
        switch (type) {
            case "BY_EQUALLY":
                return <SplitEqually />
            case "BY_AMOUNTS":
                return <SplitByAmounts />
            case "BY_PERCENTAGE":
                return <SplitByPercent />
            case "BY_SHARE":
                return <SplitByShares />
        }
    }

    useEffect(() => {
    }, [expense.selectedOption]);

    return (
        <>
            <Box display={"flex"} justifyContent={"center"} marginTop={3}>
                <ToggleButtonGroup
                    value={expense.selectedOption}
                    exclusive
                    onChange={handleSplitOption}
                    aria-label="text alignment"
                >
                    {expense.splitOptions.map((option, index) => (
                        <ToggleButton key={"s" + index} value={option} aria-label="left aligned">
                            {option.icon}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Box>
            {renderSwitch(expense?.selectedOption?.splitType)}
        </>
    )
}

export default SplitOptionsSection