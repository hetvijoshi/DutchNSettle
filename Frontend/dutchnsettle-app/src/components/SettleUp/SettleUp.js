import React, { useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, Box, Avatar, Grid, TextField, Button } from "@mui/material"
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
                    <Box alignItems={"center"}>
                        <Grid container display={"flex"} alignItems={"center"} >
                            <Grid item xs={3}>{friend.amount < 0 ? (<Avatar src={session.user["image"]} />) : (<Avatar src={friend.user.picture} />)}</Grid>
                            <Grid item xs={3}><PaidIcon /><EastIcon /></Grid>
                            <Grid item xs={5}>{friend.amount < 0 ? (<Avatar src={friend.user.picture} />) : (<Avatar src={session.user["image"]} />)}</Grid>
                        </Grid>
                        <Grid container display={"flex"} alignItems={"center"} >
                            <Grid item>{friend.amount < 0 ? `You paid ${friend.user.name}` : `${friend.user.name} paid you`}</Grid>
                        </Grid>
                        <Grid container display={"flex"} alignItems={"center"} >
                            <Grid item><TextField type={"number"} autoFocus
                                margin="dense"
                                id="name"
                                fullWidth
                                variant="standard"
                                disabled
                                defaultValue={friend.amount < 0 ? -1 * friend.amount : friend.amount} /></Grid>
                        </Grid>
                        <Grid container display={"flex"} alignItems={"center"} >
                            <Grid item>
                                <Button onClick={settleAmount}>Save</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
            </Dialog>
        </>

    )
}
