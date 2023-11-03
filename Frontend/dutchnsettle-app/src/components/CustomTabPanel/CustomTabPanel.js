import React from "react"
import FriendsTab from "./FriendsTab/FriendsTab"

const CustomTabPanel = ({tab}) => {
    console.log(tab)
    const renderSwitch = () => {
        switch (tab.toLowerCase()) {
            case "groups":
                return <div></div>
            case "friends":
                return <FriendsTab />
        }
    }
    return (
        renderSwitch()
        
    )
}

export default CustomTabPanel