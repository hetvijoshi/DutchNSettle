"use client";
import { Avatar, Box, Container, Paper, TextField } from "@mui/material"
import React, { useEffect, useState } from "react"
import classes from "./profile.module.scss"
import { useSession } from "next-auth/react"
import { getUserDetails } from "@/app/services/UserService"

const Profile = () => {

    const { data: session } = useSession();
    const [userDetails, setUserDetails] = useState({});

    const fetchUserDetails = async () => {
        const token = session?.id_token
        const userId = session?.user?.userId
        const response = await getUserDetails(userId, token)
        const friendList = response.data ? response.data : {};
        setUserDetails(friendList);
    }

    useEffect(() => {
        fetchUserDetails();
    }, [])

    return (
        <Container>
            <Paper elevation={2} className={classes.center_paper}>
                <Avatar src={userDetails?.picture} />
                <Box
                    component="form"
                    sx={{
                        "& .MuiTextField-root": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <div>
                        <TextField
                            id="outlined-FirstName-input"
                            value={userDetails?.firstName}
                            type="text"
                            autoComplete="current-firstname"
                        />
                        <TextField
                            id="outlined-LastName-input"
                            value={userDetails?.lastName}
                            type="text"
                            autoComplete="current-lastname"
                        />
                        <TextField
                            id="outlined-email-input"
                            type="email"
                            autoComplete="current-email"
                            value={userDetails?.email}
                            disabled="true"
                        />
                        <TextField
                            id="outlined-phone-input"
                            value={userDetails?.phone ? userDetails?.phone : 0}
                            type="number"
                            autoComplete="current-phone"
                        />
                    </div>
                </Box>
            </Paper>
        </Container>
    )
}

export default Profile