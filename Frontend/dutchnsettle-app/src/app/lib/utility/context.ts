import { setgroups } from "process";
import React, { createContext } from "react";

const FriendsContext = createContext({
    friends: [],
    setFriends: ([]) => { }
});

const GroupsContext = createContext({
    groups: [],
    setGroups: ([]) => { }
})

const ExpenseContext = createContext({
    expense: {},
    setExpense: ({ }) => { },
},
)

export { FriendsContext, GroupsContext, ExpenseContext };