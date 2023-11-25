"use client";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Avatar, Box, Button, DialogActions, IconButton, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import SearchWrapper from "../../../SearchWrapper/SearchWrapper";
import { getSearchResults } from "@/app/services/FriendsService";
import { IoCloseSharp } from "react-icons/io5";
import { createGroup, getGroupsByUser } from "@/app/services/GroupService";
import { GroupsContext } from "@/app/lib/utility/context";


export default function AddGroupDialog({ open, handleClose }) {
    const [groupMembers, setGroupMembers] = useState([])
    const [groupName, setGroupName] = useState("");
    const {setGroups}= useContext(GroupsContext);
    const { data: session } = useSession()

    const [results, setResults] = useState([]);

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

    const handleGroupName = (e) => {
        setGroupName(e.target.value);
    }

    const addMemberToGroup = (result) => {
        const ifExist = groupMembers.findIndex(item => item.email == result.email)
        ifExist == -1 && setGroupMembers([...groupMembers, result])
    }

    const removeMemberFromGroup = (member) => {
        const removedMember = groupMembers.find(item => item.email == member.email)
        const filteredGroupMembers = groupMembers.filter(member => member.email != removedMember.email)
        setGroupMembers(filteredGroupMembers)
    }

    const fetchAllGroups = async () => {
        const token = session["id_token"]
        const userId = session.user["userId"]
        const response = await getGroupsByUser(userId, token)
        setGroups(response.data)
      }

    const submitGroup = async () => {
        const payload = {}
        payload["groupName"] = groupName;
        payload["groupIcon"] = "";
        payload["groupMembers"] = groupMembers.map(member => { return { user: member._id } })
        payload["createdBy"] = session?.user["userId"];
        if (groupName && groupName != "" && groupMembers.length > 1) {
            const response = await createGroup(payload, session["id_token"])
            if (response.type == "success") {
                alert("Group created successfully")
                fetchAllGroups()
            }
            else {
                alert("Something went wrong")
            }
            handleClose()
        }
        else {
            alert(" provide all mandatory fields ")
        }

    }

    useEffect(() => {
        const loggedInMember = { ...session.user };
        loggedInMember["picture"] = session?.user?.image
        loggedInMember["_id"] = session?.user["userId"]
        setGroupMembers([...groupMembers, loggedInMember])
    }, [])

    return (
        <React.Fragment>
            <Dialog open={open} onClose={handleClose} maxWidth={"xs"} fullWidth>
                <DialogTitle>Create new group</DialogTitle>
                <DialogContent>
                    <Box display={"flex"} alignItems={"center"} gap={2}>
                        <div><Typography><b>Group Name</b></Typography></div>
                        <div>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Group name"
                                fullWidth
                                variant="standard"
                                value={groupName}
                                onChange={handleGroupName}
                            />
                        </div>
                    </Box>
                    <section>
                        <Box>
                            <Typography marginTop={4}><b>Add Members</b></Typography>
                        </Box>
                        <Box display={"flex"} alignItems={"center"}>
                            <SearchWrapper results={results} handleChange={handleChange} handleClick={addMemberToGroup} onBlur={() => { }} />
                        </Box>
                        {groupMembers.map((member) => (
                            <Box key={member.email} display={"flex"} alignItems={"center"} justifyContent={"space-between"} marginTop={2}>
                                <Box gap={4} display={"flex"}>
                                    <div>
                                        <IconButton sx={{ p: 0 }}>
                                            <Avatar src={member?.picture} />
                                        </IconButton>
                                    </div>
                                    <div>
                                        <Typography>{member?.name}</Typography>
                                        <Typography>{member?.email}</Typography>
                                    </div>
                                </Box>
                                <Box>
                                    {member.email != session?.user?.email && (<div>
                                        <IoCloseSharp cursor="pointer" color="red" size={"25px"} onClick={() => { removeMemberFromGroup(member) }} />
                                    </div>)}

                                </Box>
                            </Box>
                        ))}

                    </section>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={submitGroup}>Submit</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}