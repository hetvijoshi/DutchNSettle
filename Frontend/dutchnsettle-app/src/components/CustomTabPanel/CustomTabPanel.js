import React from "react"
import FriendsTab from "./FriendsTab/FriendsTab"
import GroupsTab from "./GroupsTab/GroupsTab"

const CustomTabPanel = ({ tab }) => {
    const renderSwitch = () => {
        switch (tab.toLowerCase()) {
            case "groups":
                return <GroupsTab />
            case "friends":
                return <FriendsTab />
        }
    }
    return (
        renderSwitch()
    )
}

export default CustomTabPanel