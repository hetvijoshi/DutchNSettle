"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

export default function Tabs({ tabList }) {
    const [value, setValue] = React.useState("1");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}
            >
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList onChange={handleChange}
                    >
                        {tabList.map((tab, index) => (

                            <Tab key={tab} label={tab} value={index + 1} />
                        ))}
                    </TabList>
                </Box>
                {tabList.map((tab, index) => (
                    <TabPanel key={tab} value={index + 1}></TabPanel>
                ))}
            </TabContext>
        </Box>
    );
}