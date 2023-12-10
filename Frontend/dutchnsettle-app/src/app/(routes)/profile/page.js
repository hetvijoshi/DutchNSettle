"use client";
import { Avatar, Box, Button, Container, Paper, TextField } from "@mui/material"
import React, { useEffect, useState } from "react"
import classes from "./profile.module.scss"
import { useSession } from "next-auth/react"
import { getUserDetails, putUserDetails } from "@/app/services/UserService"
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const Profile = () => {

    const { data: session } = useSession();
    const [userDetails, setUserDetails] = useState();
    const [error, setErrors] = useState({ firstName: "", lastName: "", phone: "" });
    const [alert, setAlert] = useState({ type: "", message: "" });

    const fetchUserDetails = async () => {
        const token = session["id_token"]
        const userId = session.user["userId"]
        const response = await getUserDetails(userId, token)
        const userData = response.data ? response.data : {};
        setUserDetails(userData);
    }

    const updateUserDetails = async (userData) => {
        const token = session["id_token"]
        const response = await putUserDetails(userData, token)
        if (response) {
            let { type, message } = response;
            setAlert({ type: type.toLowerCase() == "fail" ? "error" : "success", message })
        } else {
            setAlert({ type: "error", message: "Something went wrong while saving profile." })
        }
    }

    const handleChange = (field, value) => {
        let user = { ...userDetails }
        let errors = { ...error }

        switch (field.toLowerCase()) {
            case "firstname":
                if (value == undefined || value.trim().length <= 0) {
                    errors.firstName = "Enter valid first name."
                } else {
                    errors.firstName = "";
                }
                break;
            case "lastname":
                if (value == undefined || value.trim().length <= 0) {
                    errors.lastName = "Enter valid last name."
                } else {
                    errors.lastName = "";
                }
                break;
            case "phone":
                if (value.length >= 1 && value.length < 10) {
                    errors.phone = "Enter valid phone number."
                } else {
                    errors.phone = "";
                }
        }

        user[field] = value;
        setUserDetails(user);
        setErrors(errors);
    }

    const handleSave = () => {
        let user = {
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            phone: userDetails.phone,
            email: userDetails.email,
            _id: userDetails._id,
            name: userDetails.firstName + " " + userDetails.lastName
        }
        updateUserDetails(user);
    }

    const reset = () => {
        setErrors({ firstName: "", lastName: "", phone: "" });
        fetchUserDetails();
    }

    const isValidData = () => {
        let isValid = true;
        Object.keys(error).forEach(key => {
            if (error[key].length > 0) {
                isValid = false;
            }
        });
        return isValid;
    }

    const handleAlertClose = () => {
        setAlert({ type: "", message: "" })
        fetchUserDetails();
    }

    useEffect(() => {
        if (userDetails == undefined) {
            fetchUserDetails();
        }
    }, [userDetails])

    return (
        <Container>
            {alert && alert.type.length > 0 && alert.message.length > 0 &&
                <Alert severity={alert.type} onClose={() => { handleAlertClose() }}>
                    <AlertTitle>{Error}</AlertTitle>
                    {alert.message}
                </Alert>
            }
            <Paper elevation={2} className={classes.center_paper}>
                <div style={{ justifyContent: "center", display: "flex", marginTop: 20, marginBottom: 20 }}><Avatar src={userDetails?.picture} sx={{ width: 80, height: 80 }} /></div>
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
                            variant="standard"
                            label="First name"
                            value={userDetails?.firstName}
                            type="text"
                            autoComplete="current-firstname"
                            error={error && error.firstName != undefined && error.firstName.length > 0}
                            helperText={error && error.firstName ? error.firstName : ""}
                            onChange={(e) => handleChange("firstName", e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            id="outlined-LastName-input"
                            variant="standard"
                            label="Last name"
                            value={userDetails?.lastName}
                            type="text"
                            autoComplete="current-lastname"
                            error={error && error.lastName != undefined && error.lastName.length > 0}
                            helperText={error && error.lastName ? error.lastName : ""}
                            onChange={(e) => handleChange("lastName", e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            id="outlined-email-input"
                            variant="standard"
                            type="email"
                            label="Email"
                            autoComplete="current-email"
                            value={userDetails?.email}
                            disabled={true}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            id="outlined-phone-input"
                            variant="standard"
                            label="Phone number"
                            value={userDetails?.phone ? userDetails?.phone : ""}
                            type="number"
                            autoComplete="current-phone"
                            error={error && error.phone != undefined && error.phone.length > 0}
                            helperText={error && error.phone ? error.phone : ""}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </div>

                    <div style={{ justifyContent: "center", display: "flex", marginTop: 20, marginBottom: 20 }}>
                        <Button disabled={!isValidData()} onClick={() => { handleSave() }}>Save</Button>
                        <Button onClick={() => { reset() }}>Reset</Button>
                    </div>
                </Box>
            </Paper>
        </Container>
    )
}

export default Profile