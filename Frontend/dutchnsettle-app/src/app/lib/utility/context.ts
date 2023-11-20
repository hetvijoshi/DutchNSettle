import React, { createContext } from "react";

const FriendsContext = createContext({
    friends: [],
    setFriends: ([]) => { }
});

export default FriendsContext;