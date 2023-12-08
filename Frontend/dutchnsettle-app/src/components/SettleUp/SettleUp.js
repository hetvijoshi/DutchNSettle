import React, { useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, Box, Avatar, Grid, TextField, Button, DialogActions, Typography } from "@mui/material"
import PaidIcon from "@mui/icons-material/Paid";
import EastIcon from "@mui/icons-material/East";
import { useSession } from "next-auth/react";
import { settleExpenseAmount } from "@/app/services/ExpenseService";

export const SettleUp = ({ friend, open, close, setAlert }) => {

    const { data: session } = useSession();

    const settleAmount = async () => {
        let payload = {
            expenseName: friend.amount < 0 ? `${session.user["firstName"]} settled amount` : `${friend.user.firstName} settled amount`,
            expenseDate: new Date().toISOString(),
            amount: friend.amount < 0 ? -1 * friend.amount : friend.amount,
            payerId: friend.amount < 0 ? session.user["userId"] : friend.user._id,
            creditorId: friend.amount < 0 ? friend.user._id : session.user["userId"]
        };
        const token = session["id_token"]
        let response = await settleExpenseAmount(payload, token);
        setAlert({ type: response.type, message: response.message || "" });
        close();
    }

    useEffect(() => {
        console.log(friend, session);
    }, [])

    return (
        <>
            <Dialog onClose={close} open={open} maxWidth={"sm"} sx={{ minWidth: "1000px" }} fullWidth>
                <DialogTitle>Settle Up</DialogTitle>
                <DialogContent>
                    <Box textAlign={"center"}>
                        <Grid container display={"flex"} justifyContent={"center"} alignItems={"center"} gap={3} my={3}>
                            <Grid item>{friend.amount < 0 ? (<Avatar sx={{ width: 70, height: 70 }} src={session.user["image"]} />) : (<Avatar sx={{ width: 70, height: 70 }} src={friend.user.picture} />)}</Grid>
                            <Grid item><PaidIcon sx={{ fontSize: 40 }} /><EastIcon sx={{ fontSize: 40 }} /></Grid>
                            <Grid item>{friend.amount < 0 ? (<Avatar sx={{ width: 70, height: 70 }} src={friend.user.picture} />) : (<Avatar sx={{ width: 70, height: 70 }} src={session.user["image"]} />)}</Grid>
                        </Grid>
                        <Box display={"flex"} justifyContent={"center"} mt={3}>
                            <Typography>{friend.amount < 0 ? `You paid ${friend.user.name}` : `${friend.user.name} paid you`}</Typography>
                        </Box>
                        <Box display={"flex"} justifyContent={"center"}>
                            <TextField inputProps={{ style: { textAlign: "center" } }} type={"number"} autoFocus
                                margin="dense"
                                id="name"
                                // fullWidth
                                variant="standard"
                                disabled
                                defaultValue={friend.amount < 0 ? -1 * friend.amount : friend.amount} />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close}>Cancel</Button>
                    <Button onClick={settleAmount}>Save</Button>
                </DialogActions>
            </Dialog>
        </>

    )
}
