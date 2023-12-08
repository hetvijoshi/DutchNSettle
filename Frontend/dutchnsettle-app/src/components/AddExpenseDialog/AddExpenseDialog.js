import {  Autocomplete, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material"
import React, { useContext, useState } from "react"
import { useSession } from "next-auth/react";
import { getFriends, getSearchResults } from "@/app/services/FriendsService";
import AutoComplete from "../AutoComplete/AutoComplete";
import SplitOptionsSection from "./SplitOptionsSection/SplitOptionsSection";
import { ExpenseContext, FriendsContext } from "@/app/lib/utility/context";
import { addIndividualExpense } from "@/app/services/ExpenseService";
import { addGroupExpense } from "@/app/services/GroupService";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const AddExpenseDialog = ({ open, handleClose, setAlert }) => {
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

    const handleSubmit = () => {
        const payload = {}
        payload["expenseName"] = expense.description
        payload["expenseAmount"] = Number(expense.amount)
        payload["paidBy"] = expense.paidBy
        payload["expenseDate"] = expense.expenseDate
        if (expense.isGroup) {
            postGroupExpense(payload)
        }
        else {
            postIndividualExpense(payload)
        }
    }

    const postIndividualExpense = async (payload) => {

        let memberShares = []
        if (expense.selectedOption.splitType == "BY_EQUALLY" || expense.selectedOption.splitType == "BY_AMOUNTS") {
            memberShares = expense.members.map(member => {
                const expenseAmount = member.share == undefined || !member.share ? expense.amount / expense.members.length : Number(member.share)
                return { paidFor: member._id, amount: expenseAmount, splitType: expense.selectedOption.splitType }
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
            setAlert({ type: addExpense.type, message: addExpense.message })
            if (addExpense.type == "success") {
                fetchAllFriends()
            }
            handleClose()
        }
    }

    const postGroupExpense = async (payload) => {
        payload["groupId"] = expense.groupId
        let memberShares = []
        if (expense.selectedOption.splitType == "BY_EQUALLY" || expense.selectedOption.splitType == "BY_AMOUNTS") {
            memberShares = expense.members.map(member => {
                const expenseAmount = member.share == undefined || !member.share ? expense.amount / expense.members.length : Number(member.share)
                return { paidFor: member._id, amount: expenseAmount, splitType: expense.selectedOption.splitType }
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
        const addExpense = await addGroupExpense(payload, token)
        if (addExpense?.type == "success") {
            setAlert({ type: addExpense.type, message: "Group Expense added successfully" })
        }
        else {
            setAlert({ type: "error", message: "Something went wrong." })
        }
        handleClose()
    }

    const handlePaidBy = (member) => {
        expense.paidBy = member._id
    }

    const handleExpenseDate = (e) => {
        setExpense({ ...expense, expenseDate: e.$d })
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
                    <Grid container sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                        <Grid item xs={4}>
                            <Typography><b>Expense date </b></Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker value={expense.expenseDate} onChange={handleExpenseDate} maxDate={dayjs(new Date())}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                    <div>
                        <Box justifyContent={"center"} display={"flex"} marginTop={4} gap={1} alignItems={"center"}>
                            <Typography>Paid by</Typography>
                            <Autocomplete
                                sx={{ width: "150px" }}
                                {...defaultProps}
                                id="disable-close-on-select"
                                defaultValue={expense.loggedInMember}
                                onChange={(e, newValue) => handlePaidBy(newValue)}
                                renderInput={(params) => {
                                    return (<TextField {...params} variant="standard" />)
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