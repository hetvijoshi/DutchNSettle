"use client";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Button, DialogActions, Typography } from "@mui/material";
import { useContext, useState } from "react";
import SearchWrapper from "../../../SearchWrapper/SearchWrapper";
import { useSession } from "next-auth/react";
import { addFriend, getSearchResults } from "@/app/services/FriendsService";
import FriendsContext from "@/app/lib/utility/context";

export default function AddFriendDialog({ open, handleClose }) {


    //Implement functionality to add multiple friends at a time
    const [results, setResults] = useState([]);

    const { data: session } = useSession();

    const friends = useContext(FriendsContext);

    const getDropDownvalues = async (value) => {
        const searchResult = await getSearchResults(value, session["id_token"])
        const users = searchResult.data.map((user) => {
            return { ...user, displayItem: user.name }
        })
        setResults(users)
    }

    const handleChange = (value) => {
        getDropDownvalues(value);
    };

    const addToFriendList = async (result) => {
        const payload = { friendEmail: result.email }
        const token = session["id_token"]
        const addFriends = await addFriend(payload, token)
        console.log(addFriends)
        if (addFriends) {
            alert(addFriends.message)
            handleClose()
        }
    }

    return (
        <React.Fragment>
            <Dialog open={open} onClose={handleClose} maxWidth={"sm"} sx={{ minWidth: "1000px" }} fullWidth>
                <DialogTitle>Add Friend</DialogTitle>
                <DialogContent>
                    <Box display={"flex"} sx={{ paddingLeft: "10px" }}>
                        <Typography><b>To: </b></Typography>
                        <SearchWrapper results={results} handleChange={handleChange} handleClick={addToFriendList} />
                        {/* <div >
                            <SearchBar setResults={setResults} />
                            {results && results.length > 0 && <SearchResultsList results={results} setOpenAddFriend={setOpenAddFriend}/>}
                        </div> */}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Submit</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}