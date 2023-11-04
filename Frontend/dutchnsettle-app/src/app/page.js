"use client";
import { CssBaseline, Grid, Typography } from "@mui/material";
import React from "react";
import classes from "./page.module.scss";


export default function Home() {
  return (
    <>
      <CssBaseline />
      <Grid container
        direction={"column"}
        justifyContent="center"
        alignItems="center" sx={{ position: "absolute", top: "30%" }}>
        <img src={"/home_page.jpeg"} alt={"home img"} height={300} width={300} className={classes.home_image} />
        <Typography variant='h5' sx={{ color: "#23395B", marginTop: "20px", fontFamily: "FreeMono, monospace", fontWeight:"700" }}>SPLIT THE BILL, NOT THE FRIENDSHIP</Typography>
      </Grid>
    </>
  )
}
