"use client";
import { Box, Button, Container, Divider, Grid, Paper, Typography } from "@mui/material"
import React, { useState, useEffect } from "react"
import classes from "./dashboard.module.scss"
import Tabs from "@/components/Tabs/Tabs"
import { ExpenseContext, FriendsContext, GroupsContext } from "@/app/lib/utility/context";
import AddExpenseDialog from "@/components/AddExpenseDialog/AddExpenseDialog";
import { useSession } from "next-auth/react";
import { TbDecimal } from "react-icons/tb";
import { FaEquals } from "react-icons/fa";
import { FaPercentage } from "react-icons/fa";
import { FaChartBar } from "react-icons/fa6";
import { colors } from "@/styles/colors";
import dayjs from "dayjs";

const Dashboard = () => {
    const splitOptions = [
        {
            name: "Split equally",
            icon: <FaEquals />,
            chipText: "equally",
            splitType: "BY_EQUALLY"
        },
        {
            name: "Split by exact amounts",
            icon: <TbDecimal />,
            chipText: "unequally",
            splitType: "BY_AMOUNTS"
        },
        {
            name: "Split by percentages",
            icon: <FaPercentage />,
            chipText: "unequally",
            splitType: "BY_PERCENTAGE"
        },
        {
            name: "Split by shares",
            icon: <FaChartBar />,
            chipText: "unequally",
            splitType: "BY_SHARE"
        },
    ]

    const [friends, setFriends] = useState([]);
    const [groups, setGroups] = useState([]);
    const [expense, setExpense] = useState({
        results: [], description: "", amount: "", expenseDate: dayjs(new Date()), members: [], paidBy: "", loggedInMember: {}, openSplitScreen: false, selectedOption: splitOptions[0], splitOptions: splitOptions, isGroup: false
    });

    const { data: session } = useSession();
    const friendsValue = { friends, setFriends };


    const [dashboardArray, setDashboardArray] = useState([{ title: "Total balance", amount: -23.1 }, { title: "You owe", amount: -23.54 }, { title: "You are owed", amount: 0.02 }]);

    useEffect(() => {
        const loggedInMember = { ...session.user };
        loggedInMember["picture"] = session?.user?.image
        loggedInMember["_id"] = session?.user["userId"]
        expense.loggedInMember = loggedInMember
        expense.members.push(loggedInMember)
        const uniqueMembers = [...new Map(expense.members.map(item => [item._id, item])).values()]
        setExpense({ ...expense, members: uniqueMembers })

        let owe = 0;
        let areOwe = 0;
        friends.forEach((friend) => {
            if (friend.amount < 0) {
                owe += friend.amount;
            } else {
                areOwe += friend.amount;
            }
        })
        let dashboard = [...dashboardArray];
        dashboard[1].amount = owe;
        dashboard[2].amount = areOwe;
        dashboard[0].amount = areOwe + owe;
        setDashboardArray(dashboard);
    }, [friends])


    const groupsValue = { groups, setGroups };
    const expenseValue = { expense, setExpense }

    const [openAddExpense, setOpenAddExpense] = React.useState(false);

    const resetExpenseContext = () => {
        const loggedInMember = { ...session.user };
        loggedInMember["picture"] = session?.user?.image
        loggedInMember["_id"] = session?.user["userId"]
        setExpense({ results: [], description: "", amount: "", expenseDate: dayjs(new Date()), members: [loggedInMember], paidBy: loggedInMember._id, loggedInMember: loggedInMember, openSplitScreen: false, selectedOption: splitOptions[0], splitOptions: splitOptions })
    }

    const clickOpenAddExpense = () => {
        setOpenAddExpense(true);
        resetExpenseContext()
    };

    const closeAddExpense = () => {
        setOpenAddExpense(false);
        resetExpenseContext()
    };

    return (
        <Container>
            <div>
                <Paper elevation={2} className={classes.center_paper}>
                    <Grid container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Grid item ><Typography variant="h5" >Dashboard</Typography></Grid>
                        <Grid item><Button className={classes.add_expense_button} onClick={clickOpenAddExpense}>Add an expense</Button><Button className={classes.settle_up_button}>Settle Up</Button></Grid>
                    </Grid>
                    <Divider sx={{ marginY: "10px" }} />
                    <Grid container direction="row"
                        justifyContent="space-evenly"
                    >
                        {dashboardArray && dashboardArray?.map((dashItem, index) => {
                            return (
                                <div key={dashItem.title}>
                                    <Grid item >
                                        <Box>
                                            <Typography variant="body1" >{dashItem.title}</Typography>
                                            <Typography variant="body1" color={dashItem.amount < 0 ? colors.dangerDefault : colors.successDefault}>$ {dashItem.amount}</Typography>
                                        </Box>
                                    </Grid>
                                    {index != dashboardArray.length - 1 && <Divider orientation="vertical" flexItem />}
                                </div>
                            )
                        })}
                    </Grid>
                    <Divider sx={{ marginY: "10px" }} />
                    <FriendsContext.Provider value={friendsValue} >
                        <GroupsContext.Provider value={groupsValue} >
                            <Tabs tabList={["Friends", "Groups"]} />
                            {openAddExpense &&
                                <ExpenseContext.Provider value={expenseValue}>
                                    <AddExpenseDialog open={openAddExpense} handleClose={closeAddExpense} />
                                </ExpenseContext.Provider>}
                        </GroupsContext.Provider >
                    </FriendsContext.Provider>
                </Paper>
            </div>
        </Container>
    )
}

export default Dashboard