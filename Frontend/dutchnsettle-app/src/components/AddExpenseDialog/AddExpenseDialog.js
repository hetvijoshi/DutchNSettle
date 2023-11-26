import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material"
import React, { useContext, useState } from "react"
import { useSession } from "next-auth/react";
import { getSearchResults } from "@/app/services/FriendsService";
import AutoComplete from "../AutoComplete/AutoComplete";
import SplitOptionsSection from "./SplitOptionsSection/SplitOptionsSection";
import { ExpenseContext } from "@/app/lib/utility/context";

const AddExpenseDialog = ({ open, handleClose }) => {
    const { expense, setExpense } = useContext(ExpenseContext)
    const [errors, setErrors] = useState({ description: "", amount: "", membersInvolved: "", membersShareSum: "" });

    const handleExpenseDescription = (e) => {
        errors.description = ""
        setErrors(errors)
        setExpense({ ...expense, description: e.target.value })
    }

    const handleExpenseAmount = (e) => {
        errors.amount = ""
        setErrors(errors)
        setExpense({ ...expense, amount: e.target.value })
    }

    const { data: session } = useSession();
    const userId = session.user["userId"]

    const getDropDownvalues = async (value) => {
        const searchResult = await getSearchResults(value, session["id_token"])
        const users = searchResult.data.map((user) => {
            if (user._id != userId) {
                return { ...user, displayItem: user.name }
            }
        })
        setExpense({ ...expense, results: users })
    }

    const handleChange = (value) => {
        let err = { ...errors };
        err.membersInvolved = ""
        setErrors(err)
        getDropDownvalues(value);
    };

    const handleSplitScreen = () => {
        let err = { ...errors };
        if (expense?.members?.length > 1) {
            if (expense.description) {
                if (expense.amount) {
                    setExpense({ ...expense, openSplitScreen: !expense.openSplitScreen })
                }
            }
        }
        else {
            err.membersInvolved = "Expense should be between atleast 2 members"
        }
        if (!expense.description) { err.description = "Please enter description" }
        if (!expense.amount) { err.amount = "Please enter amount" }
        setErrors(err)
    }

    return (
        <React.Fragment>
            <Dialog open={open} onClose={handleClose} maxWidth={"sm"} sx={{ minWidth: "1000px" }} fullWidth>
                <DialogTitle>Add an Expense</DialogTitle>
                <DialogContent>
                    <Grid container sx={{ display: "flex", alignItems: "center" }}>
                        <Grid item xs={4}>
                            <Typography><b>With you and </b></Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <AutoComplete handleChange={handleChange} errors={errors?.membersInvolved} />
                        </Grid>
                    </Grid>
                    <Grid container sx={{ display: "flex", alignItems: "center" }}>
                        <Grid item xs={4}>
                            <Typography><b>Enter description </b></Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                error={errors?.description.length > 0 ? true : false}
                                autoFocus
                                margin="dense"
                                id="name"
                                fullWidth
                                variant="standard"
                                value={expense.description}
                                onChange={handleExpenseDescription}
                                helperText={errors?.description}
                            />
                        </Grid>
                    </Grid>
                    <Grid container sx={{ display: "flex", alignItems: "center" }}>
                        <Grid item xs={4}>
                            <Typography><b>Enter amount </b></Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                error={errors?.amount ? true : false}
                                autoFocus
                                margin="dense"
                                id="name"
                                fullWidth
                                variant="standard"
                                placeholder="$0.00"
                                value={expense.amount}
                                onChange={handleExpenseAmount}
                                type="number"
                                helperText={errors?.amount}
                            />
                        </Grid>
                    </Grid>
                    <Box justifyContent={"center"} display={"flex"} marginTop={4} gap={1} alignContent={"center"} alignItems={"center"}>
                        <Typography>Paid by</Typography>
                        <Chip label="you" variant="filled" onClick={(e) => console.log(e)} />
                        <Typography>and split</Typography>
                        <Chip label={expense?.selectedOption?.chipText ? expense?.selectedOption?.chipText : "equally"} variant="filled" clickable onClick={handleSplitScreen} />
                    </Box>
                    {expense.openSplitScreen && <SplitOptionsSection />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Submit</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default AddExpenseDialog