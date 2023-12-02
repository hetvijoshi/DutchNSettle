import React, { useState } from "react"
import { Container, Typography, Box, IconButton, Menu, MenuItem, Tooltip, Avatar, Grid, Button } from "@mui/material";
import classes from "./Navbar.module.scss";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const Navbar = () => {
    const settings = [{ title: "Profile", link: "/profile" }, { title: "Dashboard", link: "/dashboard" }, { title: "Logout" }];
    const [anchorElUser, setAnchorElUser] = useState(null);
    const { data: session } = useSession()
    const router = useRouter();

    console.log(session)

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };


    const handleCloseUserMenu = (link) => {
        setAnchorElUser(null);
        router.push(link);
    };
    return (
        <nav className={classes.navbar}>
            <Container>
                <Grid container justifyContent={"space-between"} alignItems={"center"} >
                    <Grid item>
                        <img src="/Logo.png" height="80px" width="150px" />
                    </Grid>
                    {session?.user ? (
                        <Grid item>
                            <Box sx={{ flexGrow: 1 }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar src={session?.user?.image} />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: "45px" }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem key={setting.title} onClick={() => { setting.title == "Logout" ? signOut({ callbackUrl: "http://localhost:3000" }) : handleCloseUserMenu(setting.link) }}>
                                            <Typography textAlign="center">{setting.title}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>

                            </Box>
                        </Grid>
                    ) : <Button className={classes.sign_in_button} onClick={() => signIn("google", { callbackUrl: "http://localhost:3000/dashboard" })}>Sign In</Button>
                    }
                </Grid>
            </Container>
        </nav >
    )
}

