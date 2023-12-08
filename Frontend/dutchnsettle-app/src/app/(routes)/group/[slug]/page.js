"use client"
import { Avatar, Container, Paper, Grid, Box, Button, Typography, Divider, List, ListItemButton, Collapse, Card, Alert, AlertTitle } from "@mui/material"
import React, { useEffect, useState } from "react"
import classes from "./group.module.scss"
import { useSession } from "next-auth/react"
import { getGroupDetail } from "@/app/services/GroupService"
import Link from "next/link"
import { ExpenseContext } from "@/app/lib/utility/context";
import AddExpenseDialog from "@/components/AddExpenseDialog/AddExpenseDialog"
import { TbDecimal } from "react-icons/tb";
import { FaEquals } from "react-icons/fa";
import { FaPercentage } from "react-icons/fa";
import { FaChartBar } from "react-icons/fa6";
import dayjs from "dayjs"
import { getFriends } from "@/app/services/FriendsService";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { colors } from "@/styles/colors";
import { getGroupExpenseDetails } from "@/app/services/ExpenseService";
import { SettleUp } from "../../../../components/SettleUp/SettleUp";

const Group = ({ params }) => {
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
    const [groupDetail, setGroupDetail] = useState();
    const [expense, setExpense] = useState({
        groupId: params.slug, groupName: groupDetail?.groupName, results: [], description: "", amount: "", members: [], paidBy: "", expenseDate: dayjs(new Date()), loggedInMember: {}, openSplitScreen: false, selectedOption: splitOptions[0], splitOptions: splitOptions, isGroup: true
    });
    const expenseValue = { expense, setExpense }
    const { data: session } = useSession();
    const [friends, setFriends] = useState();
    const [expenseDetails, setExpenseDetails] = useState([]);
    const [expandIndex, setExpandIndex] = useState(0);
    const [openSettleUp, setSettleUp] = useState(false);
    const [settleUpFriend, setSettleUpFriend] = useState({});
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [openAddExpense, setOpenAddExpense] = React.useState(false);

    const fetchGroupDetail = async () => {
        const fetchGroupDetails = await getGroupDetail(params.slug, session["id_token"])
        setGroupDetail(fetchGroupDetails)
    }

    const fetchFriends = async () => {
        const token = session["id_token"]
        const userId = session.user["userId"]
        const response = await getFriends(userId, token)
        const friendList = response.data.friends ? response.data.friends : [];
        let friends = [];
        friendList.map(f => {
            let g = f.groups.find(g => g.groupId == params.slug && g.amount != 0);
            if (g != undefined) {
                friends.push({ user: f.user, amount: g.amount });
            }
        });
        console.log(params.slug, friendList, friends);
        setFriends(friends);
    }

    const fetchAllExpense = async (groupId) => {
        const token = session["id_token"];
        const response = await getGroupExpenseDetails(groupId, token)
        const expenseData = response.data ? response.data : {};
        setExpenseDetails(expenseData);
    }

    const fetchPageData = () => {
        fetchGroupDetail();
        fetchFriends();
        fetchAllExpense(params.slug);
    }

    useEffect(() => {
        fetchPageData()
    }, [params.slug])

    const handleAlertClose = () => {
        setAlert({ type: "", message: "" });
    }

    const resetExpenseContext = () => {
        console.log("hi")
        const loggedInMember = { ...session.user };
        loggedInMember["picture"] = session?.user?.image
        loggedInMember["_id"] = session?.user["userId"]
        expense.members.push(loggedInMember)
        const alteredGroupMembers = groupDetail.groupMembers.map((member) => { return { ...member.user, checked: true } })
        const uniqueMembers = [...new Map(alteredGroupMembers.map(item => [item._id, item])).values()]
        setExpense({
            groupId: params.slug, groupName: groupDetail?.groupName, results: [], description: "", amount: "", expenseDate: dayjs(new Date()), members: uniqueMembers, paidBy: loggedInMember._id, loggedInMember: loggedInMember, openSplitScreen: false, selectedOption: splitOptions[0], splitOptions: splitOptions, isGroup: true
        })
    }

    const clickOpenAddExpense = () => {
        setOpenAddExpense(true);
        resetExpenseContext()
    };

    const closeAddExpense = () => {
        setOpenAddExpense(false);
        resetExpenseContext()
    };

    const handleCollapse = (index) => {
        if (expandIndex == (index + 1)) {
            setExpandIndex(0);
        } else {
            setExpandIndex(index + 1);
        }
    }

    const handleSettleFriend = (friendDetail) => {
        setSettleUpFriend(friendDetail);
        setSettleUp(true);
    }

    const closeSettleUpDialog = () => {
        setSettleUpFriend({});
        setSettleUp(false);
        fetchPageData();
    }

    return (
        <>
            {alert && alert.type.length > 0 && alert.message.length > 0 &&
                <Alert severity={alert.type} onClose={() => { handleAlertClose() }}>
                    <AlertTitle>{alert.type.toUpperCase()}</AlertTitle>
                    {alert.message}
                </Alert>
            }
            <Container padding={3}>
                <Paper elevation={2} className={classes.center_paper}>
                    <Link href="/dashboard" style={{ textDecoration: "none" }}>{"< Back"}</Link>
                    <Divider sx={{ marginY: "10px" }} />
                    <Grid container alignItems={"center"} justifyContent={"space-between"} >
                        <Grid item>
                            <Box gap={2}>
                                <div>{groupDetail?.groupIcon}</div>
                                <Typography variant="h5">{groupDetail?.groupName}</Typography>
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box gap={2}>
                                <Button onClick={clickOpenAddExpense}>Add an expense</Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider sx={{ marginY: "10px" }} />
                    <Grid>
                        {friends && friends.length > 0 && friends.map((friendDetail, index) => (
                            <Card key={{ index }} sx={{ minWidth: 180, padding: 2, margin: 2 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography sx={{ fontSize: 18, margin: 0 }} color={colors.black} gutterBottom>
                                        {friendDetail.user.name}
                                    </Typography>
                                    <Box gap={2} display={"flex"} alignItems={"center"}>
                                        <Typography sx={{ fontSize: 18, margin: 0 }} color={friendDetail.amount < 0 ? colors.dangerDefault : colors.successDefault} gutterBottom>
                                            {"$" + friendDetail.amount}
                                        </Typography>
                                        <Button sx={{ padding: 0 }} onClick={() => handleSettleFriend(friendDetail)}>
                                            {"Settle Up"}
                                        </Button>
                                    </Box>
                                </div>
                            </Card >
                        ))}
                        {openSettleUp && (<SettleUp friend={settleUpFriend} open={openSettleUp} close={closeSettleUpDialog} setAlert={setAlert} groupId={params.slug} />)}
                    </Grid>

                    <Divider sx={{ marginY: "10px" }} />
                    {expenseDetails && expenseDetails.length > 0 && (
                        expenseDetails.map((expense, index) => (
                            <>
                                <ListItemButton onClick={() => { handleCollapse(index) }} style={{ marginTop: 5, backgroundColor: colors.lightBlue, borderRadius: 3 }}>
                                    <Grid container key={index} alignItems="center" style={{ padding: 10 }}>
                                        <Grid item xs={1}>
                                            <div>{new Date(expense.expenseSummary.expenseDate).toLocaleString("default", { month: "short", day: "numeric", year: "2-digit" })}</div>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <div>{expense.expenseSummary.expenseName}</div>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <div>{expense.expenseSummary.paidBy._id == session.user["userId"] ? "You paid " : expense.expenseSummary.paidBy.firstName + " paid"} <span style={{ color: expense.expenseSummary.paidBy._id == session.user["userId"] ? "green" : "red" }}>${expense.expenseSummary.expenseAmount}</span></div>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <div>{expense.expenseSummary.paidBy._id == session.user["userId"] ? "You lent " : "You owe "}
                                                <span style={{ color: expense.expenseSummary.paidBy._id == session.user["userId"] ? "green" : "red" }}>
                                                    ${expense.expenseSummary.paidBy._id == session.user["userId"] ? expense.expenseSummary.expenseAmount - expense.expenseDetail.find(expense => expense.paidFor._id == session.user["userId"])?.amount : expense.expenseDetail.find(expense => expense.paidFor._id == session.user["userId"])?.amount}
                                                </span>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    {expandIndex == (index + 1) ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={expandIndex == (index + 1)} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {expense.expenseDetail && expense.expenseDetail.length > 0 && (expense.expenseDetail.map((detail, index) => (
                                            <ListItemButton sx={{ pl: 4 }} key={"d" + index}>
                                                <Grid container key={index} alignItems="center" style={{ padding: 3 }}>
                                                    <Grid item xs={1} display={"flex"} justifyContent={"center"}>{index + 1}.</Grid>
                                                    <Grid item xs={1}><Avatar alt="Natacha" src={detail.paidFor.picture} /></Grid>
                                                    <Grid item xs={2}>{detail.paidFor._id == session.user["userId"] ? "You owe" : detail.paidFor.firstName + " owe "}</Grid>
                                                    <Grid item xs={2}>${detail.amount}</Grid>
                                                </Grid>
                                            </ListItemButton>
                                        )

                                        ))}
                                    </List>
                                </Collapse>

                            </>
                        ))

                    )}
                    {expenseDetails && expenseDetails.length == 0 && (
                        <>

                            <Container sx={{ marginTop: 5 }}>
                                No expenses yet.
                            </Container>
                        </>
                    )}
                </Paper>
            </Container >
            {openAddExpense &&
                <ExpenseContext.Provider value={expenseValue}>
                    <AddExpenseDialog open={openAddExpense} handleClose={closeAddExpense} />
                </ExpenseContext.Provider>
            }
        </>
    )
}

export default Group