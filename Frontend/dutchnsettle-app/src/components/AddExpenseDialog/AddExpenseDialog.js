import { Autocomplete, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material"
import React, { useContext, useState } from "react"
import { useSession } from "next-auth/react";
import { getFriends, getSearchResults } from "@/app/services/FriendsService";
import AutoComplete from "../AutoComplete/AutoComplete";
import SplitOptionsSection from "./SplitOptionsSection/SplitOptionsSection";
import { ExpenseContext, FriendsContext } from "@/app/lib/utility/context";
import { addIndividualExpense } from "@/app/services/ExpenseService";

const AddExpenseDialog = ({ open, handleClose }) => {
    const { expense, setExpense } = useContext(ExpenseContext)
    const [errors, setErrors] = useState({ description: "", amount: "", membersInvolved: "", membersShareSum: "" });
    const { setFriends } = useContext(FriendsContext);

    const defaultProps = {
        options: expense.members,
        getOptionLabel: (option) => option.name,
    };

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

    const fetchAllFriends = async () => {
        const token = session["id_token"]
        const userId = session.user["userId"]
        const response = await getFriends(userId, token)
        const friendList = response.data.friends ? response.data.friends : [];
        setFriends(friendList);
    }

    const handleSubmit = async () => {
        const payload = {}
        payload["expenseName"] = expense.description
        payload["expenseAmount"] = Number(expense.amount)
        payload["paidBy"] = expense.loggedInMember._id
        payload["expenseDate"] = new Date().toISOString()
        let memberShares = []
        if (expense.selectedOption.splitType == "BY_EQUALLY" || expense.selectedOption.splitType == "BY_AMOUNTS") {
            memberShares = expense.members.map(member => {
                return { paidFor: member._id, amount: Number(member.share), splitType: expense.selectedOption.splitType }
            })
        }
        else if (expense.selectedOption.splitType == "BY_PERCENTAGE") {
            memberShares = expense.members.map(member => {
                return { paidFor: member._id, amount: Number(expense.amount * (member.share / 100)), splitType: expense.selectedOption.splitType }
            })
        }
        else {
            const totalShare = expense.members.reduce((a, b) => a + (Number(b["share"]) || 0), 0)
            memberShares = expense.members.map(member => {
                return { paidFor: member._id, amount: Number((expense.amount * member.share) / totalShare), splitType: expense.selectedOption.splitType }
            })
        }
        payload["shares"] = memberShares
        const token = session["id_token"]
        const addExpense = await addIndividualExpense(payload, token)
        if (addExpense) {
            alert(addExpense.message)
            if (addExpense.type == "success") {
                fetchAllFriends()
            }
            handleClose()
        }
    }

    const handlePaidBy = (e) => {
        expense.members.map(member => {
            if (member.name == e.target.value) {
                expense.paidBy = member._id
            }
        })
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
                    <div>
                        <Box justifyContent={"center"} display={"flex"} marginTop={4} gap={1} alignItems={"center"}>
                            <Typography>Paid by</Typography>
                            <Autocomplete
                                sx={{width:"150px"}}
                                {...defaultProps}
                                id="disable-close-on-select"
                                defaultValue={expense.loggedInMember}
                                renderInput={(params) => {
                                    return (<TextField {...params} variant="standard" onClick={handlePaidBy} />)
                                }}
                            />
                            <Typography>and split</Typography>
                            <Chip label={expense?.selectedOption?.chipText ? expense?.selectedOption?.chipText : "equally"} variant="filled" clickable onClick={handleSplitScreen} />
                        </Box>
                    </div>
                    {expense.openSplitScreen && <SplitOptionsSection />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default AddExpenseDialog