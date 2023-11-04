import { CustomCard } from "@/components/CustomCard/CustomCard"
import React from "react"
import classes from "./FriendsTab.module.scss"

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
    return (
        <>
            <div className={classes.card_wrapper}>
                {friends.map((friend) => (
                    <CustomCard key={friend.name} friendDetail={friend} />
                ))}
            </div>
        </>

    )
}

export default FriendsTab