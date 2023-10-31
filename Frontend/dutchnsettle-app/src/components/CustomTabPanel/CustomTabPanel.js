import React from "react"

const CustomTabPanel = () => {
    const renderSwitch = (tab) => {
        switch (tab) {
            case "groups":
                return <div></div>
            case "friends":
                return <div></div>
        }
    }
    return (
        renderSwitch()
    )
}

export default CustomTabPanel