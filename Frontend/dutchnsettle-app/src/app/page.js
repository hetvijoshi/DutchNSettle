"use client";
import { Button, Grid } from "@mui/material";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()
  console.log(session)
  if (session && session.user) {
    return (
      <>
        <p>{session.user.name}</p>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </>
    )
  }
  return (
    <>
      <Grid container
        direction="row"
        justifyContent="center"
        alignItems="center" >
        Dashboard
        <Button onClick={() => signIn()}>Sign in with Google</Button>
      </Grid>
    </>
  )
}
