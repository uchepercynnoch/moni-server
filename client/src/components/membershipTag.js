import React from "react";

export default function MembershipTag(props) {
    const membershipTagStyle = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        backgroundColor: "#ecf0f1",
        padding: "5px"
    };
    const membershipImage = type => {
        if (type === "blue")
            return (
                <div style={membershipTagStyle}>
                    <img width="25" height="25" src={require("../assets/blue-medal.png")} />
                    <p style={{ fontWeight: "bold", margin: "0px" }}>{props.label}</p>
                </div>
            );
        else if (type === "gold")
            return (
                <div style={membershipTagStyle}>
                    <img width="25" height="25" src={require("../assets/gold-medal.png")} />
                    <p style={{ fontWeight: "bold", margin: "0px" }}>{props.label}</p>
                </div>
            );
        else if (type === "platinum")
            return (
                <div style={membershipTagStyle}>
                    <img width="25" height="25" src={require("../assets/platinum-medal.png")} />
                    <p style={{ fontWeight: "bold", margin: "0px" }}>{props.label}</p>
                </div>
            );
    };
    return membershipImage(props.type);
}
