import React, { Component } from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { useStyles } from "../styles/dashboard.style";
import PointsChart from "../components/points.chart";
import { getUserData } from "../util";
import AdminChart from "../components/adminchart";
import { Typography } from "@material-ui/core";

export default function Overview() {
    const classes = useStyles();
    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                {/* Chart */}
                <Grid item xs={12}>
                    <Typography style={{marginBottom: "10px"}} variant="h4" component="h3">Hello! {getUserData().name}</Typography>
                    <Paper style={{ padding: "10px" }}>
                        {/* <Chart/> */}
                        {getUserData().role === "super-admin" ? <AdminChart /> : <PointsChart />}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
