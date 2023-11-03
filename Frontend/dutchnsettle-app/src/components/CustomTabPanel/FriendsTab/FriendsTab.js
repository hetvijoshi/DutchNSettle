import { CustomCard } from "@/components/CustomCard/CustomCard"
import React from "react"
import classes from "./FriendsTab.module.scss"
import { Button } from "@mui/material"
import CustomDialog from "@/components/CustomDialog/CustomDialog"

const FriendsTab = () => {
    const friends = [
        {
            name: "Ram Shah",
            balance: -23,
        },
        {
            name: "Raman Rana",
            balance: 25,
        },
        {
            name: "Kinjal Dave",
            balance: -78,
        },
        {
            name: "Priety Rane",
            balance: 90,
        },
        {
            name: "Tribhuvandas  Birju",
            balance: 90,
        },
        {
            name: "Bhuperndra Jogi",
            balance: 90,
        },
    ]
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <div className={classes.card_wrapper}>
                {friends.map((friend) => (
                    <CustomCard key={friend.name} friendDetail={friend} />
                ))}
            </div>
            <div className={classes.button_wrapper}>
                <Button className={classes.add_friends_button} onClick={handleClickOpen}>Add Friends</Button>
            </div>
            <CustomDialog open={open} handleClose={handleClose}/>
        </>

    )
}

export default FriendsTab