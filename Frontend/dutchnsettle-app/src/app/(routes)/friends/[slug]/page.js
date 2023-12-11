"use client";
import { Container, Paper, Avatar, Chip, Button, List, ListItemButton, Collapse, Divider } from "@mui/material"
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react"
import classes from "../../dashboard/dashboard.module.scss"
import { useSession } from "next-auth/react";
import { getExpenseDetails } from "@/app/services/ExpenseService";
import { getUserDetails } from "@/app/services/UserService"
import Link from "next/link";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { colors } from "@/styles/colors";
import { getFriends } from "@/app/services/FriendsService";
import { SettleUp } from "../../../../components/SettleUp/SettleUp";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const Friends = ({ params }) => {

  const { data: session } = useSession();
  const [expenseDetails, setExpenseDetails] = useState();
  const [userDetails, setUserDetails] = useState();
  const [expandIndex, setExpandIndex] = useState(0);
  const [friend, setFriend] = useState();
  const [openSettleUp, setSettleUp] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const fetchAllExpense = async (friendId) => {
    const token = session["id_token"];
    const userId = session.user["userId"]
    const response = await getExpenseDetails({ userId, friendId }, token)
    const expenseData = response.data ? response.data : {};
    setExpenseDetails(expenseData);
  }

  const fetchUser = async (userId) => {
    const token = session["id_token"]
    const response = await getUserDetails(userId, token)
    const userData = response.data ? response.data : {};
    setUserDetails(userData);
  }

  const fetchFriend = async () => {
    const token = session["id_token"]
    const userId = session.user["userId"]
    const response = await getFriends(userId, token)
    const friendList = response.data.friends ? response.data.friends : [];
    const friendData = friendList.filter(x => x.user._id == params.slug)
    setFriend(friendData);
  }

  const handleCollapse = (index) => {
    if (expandIndex == (index + 1)) {
      setExpandIndex(0);
    } else {
      setExpandIndex(index + 1);
    }
  }

  const closeSettleUpDialog = () => {
    setSettleUp(!openSettleUp);
    fetchPageData();
  }

  const handleAlertClose = () => {
    setAlert({ type: "", message: "" });
  }

  const fetchPageData = () => {
    fetchUser(params.slug);
    fetchFriend();
    fetchAllExpense(params.slug);
  }

  useEffect(() => {
    fetchPageData()
  }, [])
  return (
    <>
      {alert && alert.type.length > 0 && alert.message.length > 0 &&
        <Alert severity={alert.type} onClose={() => { handleAlertClose() }}>
          <AlertTitle>{alert.type.toUpperCase()}</AlertTitle>
          {alert.message}
        </Alert>
      }
      <Container>
        <Paper elevation={2} className={classes.center_paper}>
          <Grid container
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            style={{ marginBottom: 5, marginTop: 3 }}
          >
            <Grid item xs={1} style={{ paddingLeft: 5 }} ><Link href="/dashboard" style={{ textDecoration: "none", paddingRight: 10 }}>{"< Back"}</Link></Grid>
            <Grid item xs={2}>
              <Chip
                color={friend && (friend[0].amount == undefined || friend[0].amount == 0) ? "success" : "error"}
                avatar={<Avatar alt="Natacha" src={userDetails?.picture} />}
                label={<strong>{userDetails?.name}</strong>}
              />
            </Grid>
            <Grid item xs={8} alignContent={"right"}><Button disabled={friend && (friend[0].amount == undefined || friend[0].amount == 0)} onClick={() => { setSettleUp(!openSettleUp) }}>Settle up</Button></Grid>
            <Grid>
              {openSettleUp && (<SettleUp friend={friend[0]} open={openSettleUp} close={closeSettleUpDialog} setAlert={setAlert} />)}
            </Grid>
          </Grid>
          <Divider />
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
                    <Grid item xs={3}>
                      <div>{expense.expenseSummary.paidBy._id == session.user["userId"] ? "You paid " : expense.expenseSummary.paidBy.firstName + " paid"} <span style={{ color: expense.expenseSummary.paidBy._id == session.user["userId"] ? "green" : "red" }}>${expense.expenseSummary.expenseAmount}</span></div>
                    </Grid>
                    <Grid item xs={3}>
                      {expense.expenseDetail[0].splitType != "SETTLED" &&
                        (<div>{expense.expenseSummary.paidBy._id == session.user["userId"] ? "You lent " : "You owe "} <span style={{ color: expense.expenseSummary.paidBy._id == session.user["userId"] ? "green" : "red" }}>${expense.expenseSummary.paidBy._id == session.user["userId"] ? expense.expenseDetail.find(expense => expense.paidFor._id == params.slug).amount : expense.expenseDetail.find(expense => expense.paidFor._id == session.user["userId"]).amount}</span></div>)}

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
      </Container>
    </>

  )
}

export default Friends