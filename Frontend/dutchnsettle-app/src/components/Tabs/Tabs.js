"use client";
import React, { lazy } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CustomTabPanel from "../CustomTabPanel/CustomTabPanel";
import { Button } from "@mui/material";
import classes from "./Tabs.module.scss"
import AddFriendDialog from "../CustomTabPanel/FriendsTab/AddFriendDialog/AddFriendDialog";
const AddGroupDialog = lazy(() => import("../CustomTabPanel/GroupsTab/AddGroupDialog/AddGroupDialog"))

export default function Tabs({ tabList }) {
    const [value, setValue] = React.useState("1");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [openAddFriend, setOpenAddFriend] = React.useState(false);

    const clickOpenAddFriend = () => {
        setOpenAddFriend(true);
    };

    const closeAddFriend = () => {
        setOpenAddFriend(false);
    };
    const [openAddGroup, setOpenAddGroup] = React.useState(false);

    const clickOpenAddGroup = () => {
        setOpenAddGroup(true);
    };

    const closeAddGroup = () => {
        setOpenAddGroup(false);
    };

    return (
        <>
            <Box sx={{ width: "100%", typography: "body1" }}>
                <TabContext value={value}
                >
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                        <TabList onChange={handleChange}
                        >
                            {tabList.map((tab, index) => (
                                <Tab key={tab} label={tab} value={(index + 1).toString()} />
                            ))}
                        </TabList>
                        <div>
                            <Button className={classes.add_friends_button} onClick={clickOpenAddFriend}>Add Friends</Button>
                            <Button className={classes.add_group_button} onClick={clickOpenAddGroup}>Add Group</Button>
                        </div>
                    </Box>
                    {tabList.map((tab, index) => (
                        <TabPanel key={tab} value={(index + 1).toString()} >
                            <CustomTabPanel tab={tab} />
                        </TabPanel>
                    ))}
                </TabContext>
            </Box>
            {openAddFriend && <AddFriendDialog open={openAddFriend} handleClose={closeAddFriend} />}
            {openAddGroup && <AddGroupDialog open={openAddGroup} handleClose={closeAddGroup} />}

        </>
    );
}