import React from "react";
import { Paper, Chip, Typography} from "@material-ui/core";

export default function StatCard(props) {
    const chipStyle = {
        color: "white",
        backgroundColor: "#070E2E",
        borderBottomRightRadius: "0px",
        borderBottomLeftRadius: "0px"
    };
    const cardStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "75px",
        width: "150px",
        margin: "5px",
        borderTopRightRadius: "16px",
        borderTopLeftRadius: "16px"
    };
    return (
        <Paper style={cardStyle}>
            <Chip size="small" style={{ ...chipStyle, width: "100%" }} label={props.tag} />
            <Typography style={{ bottom: 0 }} variant="h6" component="h5">
                {props.value}
            </Typography>
        </Paper>
    );
} 