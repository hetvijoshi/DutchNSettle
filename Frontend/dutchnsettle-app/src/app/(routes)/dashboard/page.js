import { Box, Button, Container, Divider, Grid, Paper, Typography } from "@mui/material"
import React from "react"
import classes from "./dashboard.module.scss"
import Tabs from "@/components/Tabs/Tabs"

const Dashboard = () => {
    const dashboardArray = [{ title: "total balance", dollar: "-$23.1" }, { title: "you owe", dollar: "-$23.54" }, { title: "you are owed", dollar: "$0.02" }]
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
                        <Grid item><Button className={classes.add_expense_button}>Add an expense</Button><Button className={classes.settle_up_button}>Settle Up</Button></Grid>
                    </Grid>
                    <Divider sx={{ marginY: "10px" }} />
                    <Grid container direction="row"
                        justifyContent="space-evenly"
                    >
                        {dashboardArray.map((dashItem, index) => {
                            return (
                                <>
                                    <Grid key={dashItem.title} item >
                                        <Box>
                                            <Typography variant="body1" >{dashItem.title}</Typography>
                                            <Typography variant="body1" >{dashItem.dollar}</Typography>
                                        </Box>
                                    </Grid>
                                    {index != dashboardArray.length - 1 && <Divider orientation="vertical" flexItem />}
                                </>
                            )
                        })}
                    </Grid>
                    <Divider sx={{ marginY: "10px" }} />
                    <Tabs tabList={["Friends", "Groups"]} />
                </Paper>
            </div>
        </Container>
    )
}

export default Dashboard