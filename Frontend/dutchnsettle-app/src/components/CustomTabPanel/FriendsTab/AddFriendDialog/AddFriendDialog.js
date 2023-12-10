"use client";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete, TextField, Box, Button, DialogActions, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { useSession } from "next-auth/react";
import { addFriend, getFriends, getSearchResults } from "@/app/services/FriendsService";
import { FriendsContext } from "@/app/lib/utility/context";

export default function AddFriendDialog({ open, handleClose, setAlert }) {


    //Implement functionality to add multiple friends at a time
    const [results, setResults] = useState([]);

    const { data: session } = useSession();

    const { setFriends } = useContext(FriendsContext);

    const defaultProps = {
        options: results,
        getOptionLabel: (option) => option.name,
    };

    const getDropDownvalues = async (e) => {
        const searchKey = e.target.value
        setResults([]);
        if (searchKey.length > 0) {
            const searchResult = await getSearchResults(e.target.value, session["id_token"])
            setResults(searchResult.data)
        }
    }

    const fetchAllFriends = async () => {
        const token = session["id_token"]
        const userId = session.user["userId"]
        const response = await getFriends(userId, token)
        const friendList = response.data.friends ? response.data.friends : [];
        setFriends(friendList);
    }

    const addToFriendList = async (result) => {
        const payload = { friendEmail: result.email }
        const token = session["id_token"]
        const addFriends = await addFriend(payload, token)
        if (addFriends) {
            setAlert({ type: addFriends.type, message: addFriends.message })
            handleClose()
            fetchAllFriends()
        }
    }

    return (
        <React.Fragment>
            <Dialog open={open} onClose={handleClose} maxWidth={"sm"} sx={{ minWidth: "1000px" }} fullWidth>
                <DialogTitle>Add Friend</DialogTitle>
                <DialogContent>
                    <Box display={"flex"} gap={2}>
                        <Typography><b>To: </b></Typography>
                        <Autocomplete
                            sx={{ width: "150px" }}
                            {...defaultProps}
                            id="disable-close-on-select"
                            onInput={(value) => getDropDownvalues(value)}
                            onChange={(e, value) => addToFriendList(value)}
                            renderInput={(params) => {
                                return (<TextField {...params} variant="standard" />)
                            }}
                        />

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}