import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { colors } from "@/styles/colors";
import classes from "./CustomCard.module.scss";


export const CustomCard = ({ friendDetail }) => {
    return (
        <Card sx={{ minWidth: 180, padding: 1, margin: 1}}>
            <CardContent sx={{ padding: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontSize: 18 }} color={colors.black} gutterBottom>
                        {friendDetail.name}
                    </Typography>
                    <Typography sx={{ fontSize: 18 }} color={friendDetail.balance < 0 ? colors.dangerDefault : colors.successDefault} gutterBottom>
                        {"$" + friendDetail.balance}
                    </Typography>
                </div>
            </CardContent>
            <CardActions sx={{ padding: 0 }}>
                <Link href="/" className={classes.link_style}>View details</Link>
            </CardActions>
        </Card >
    );
}