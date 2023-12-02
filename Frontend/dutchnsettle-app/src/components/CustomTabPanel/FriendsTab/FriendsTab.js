
import React, { useContext, useEffect } from "react"
import classes from "./FriendsTab.module.scss"
import { getFriends } from "@/app/services/FriendsService"
import { useSession } from "next-auth/react"
import { FriendCustomCard } from "@/components/FriendCustomCard/FriendCustomCard"
import { FriendsContext } from "@/app/lib/utility/context"

const FriendsTab = () => {
    const { data: session } = useSession();
    const { friends, setFriends } = useContext(FriendsContext);

    const fetchAllFriends = async () => {
        const token = session["id_token"]
        const userId = session.user["userId"]
        const response = await getFriends(userId, token)
        const friendList = response.data.friends ? response.data.friends : [];
        setFriends(friendList);
    }

    useEffect(() => {
        if (session && friends.length <= 0) {
            fetchAllFriends()
        }
    }, [session, setFriends])
    return (
        <>
            {
                session && (
                    <div className={classes.card_wrapper}>
                        {friends?.map((friend) => (
                            <FriendCustomCard key={friend.user.name} friendDetail={friend} />
                        ))}
                    </div>
                )
            }

        </>

    )
}

export default FriendsTab