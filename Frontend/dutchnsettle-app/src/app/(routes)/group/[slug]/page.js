"use client"
import { Container, Paper, Grid, Box, Button, Typography, Divider } from "@mui/material"
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
    const { data: session } = useSession()

    const fetchGroupDetail = async () => {
        const fetchGroupDetails = await getGroupDetail(params.slug, session["id_token"])
        setGroupDetail(fetchGroupDetails)
    }

    useEffect(() => {
        fetchGroupDetail()
    }, [params.slug])

    // useEffect(() => {
    //     const loggedInMember = { ...session.user };
    //     loggedInMember["picture"] = session?.user?.image
    //     loggedInMember["_id"] = session?.user["userId"]
    //     expense.loggedInMember = loggedInMember

    //     setExpense({ ...expense, members: uniqueMembers })
    // }, [])

    const [openAddExpense, setOpenAddExpense] = React.useState(false);

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

    return (
        <>
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
                                <Button>Settle up</Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider sx={{ marginY: "10px" }} />
                </Paper>
            </Container>
            {openAddExpense &&
                <ExpenseContext.Provider value={expenseValue}>
                    <AddExpenseDialog open={openAddExpense} handleClose={closeAddExpense} />
                </ExpenseContext.Provider>}
        </>
    )
}

export default Group