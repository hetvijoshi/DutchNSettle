"use client";
import { Button, Container, Paper } from "@mui/material"
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react"
import classes from "../../dashboard/dashboard.module.scss"
import { useSession } from "next-auth/react";
import { getExpenseDetails } from "@/app/services/ExpenseService";

const Friends = ({ params }) => {

  const { data: session } = useSession();
  const [expenseDetails, setExpenseDetails] = useState();

  const fetchAllExpense = async (friendId) => {
    const token = session["id_token"];
    const userId = session.user["userId"]
    const response = await getExpenseDetails({ userId, friendId }, token)
    const expenseData = response.data ? response.data : {};
    setExpenseDetails(expenseData);
  }

  useEffect(() => {
    fetchAllExpense(params.slug);
  }, params.slug)
  return (
    <Container>
      <Paper elevation={2} className={classes.center_paper}>
        {expenseDetails && expenseDetails.length > 0 && (
          expenseDetails.map((expense, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={1}>
                <div>{new Date(expense.expenseId.expenseDate).toLocaleString("default", { month: "short", day: "numeric" })}</div>
              </Grid>
              <Grid item xs={1}>
                <div>Icon</div>
              </Grid>
              <Grid item xs={3}>
                <div>{expense.expenseId.expenseName}</div>
              </Grid>
              <Grid item xs={2}>
                <div>{expense.paidBy._id.toString() == session["userId"] ? "You paid " : ""} $ {expense.expenseId.expenseAmount}</div>
              </Grid>
              <Grid item xs={2}>
                <div>$ {expense.amount}</div>
              </Grid>
              <Grid item xs={2}>
                <Button>Settle up</Button>
              </Grid>
              <Grid item xs={1}>
                <Button>Delete</Button>
              </Grid>
            </Grid>
          ))

        )}
      </Paper>
    </Container>
  )
}

export default Friends