
import React, { useEffect, useState } from "react"
import classes from "./FriendsTab.module.scss"
import { getFriends } from "@/app/services/FriendsService"
import { useSession } from "next-auth/react"
import { FriendCustomCard } from "@/components/FriendCustomCard/FriendCustomCard"

const FriendsTab = () => {
    const { data: session } = useSession();
    const [friendsList, setFriendsList] = useState([]);

    const fetchAllFriends = async () => {
        const token = session["id_token"]
        const userId = session.user["userId"]
        const response = await getFriends(userId, token)
        const friendList = response.data.friends ? response.data.friends : []; 
        setFriendsList(friendList);
    }
    
    useEffect(() => {
        if (session) {
            console.log(session)
            fetchAllFriends()
        }
    }, [session])
    return (
        <>
            {
                session && (
                    <div className={classes.card_wrapper}>
                        {friendsList?.map((friend) => (
                            <FriendCustomCard key={friend.user.name} friendDetail={friend} />
                        ))}
                    </div>
                )
            }

        </>

    )
}

export default FriendsTab