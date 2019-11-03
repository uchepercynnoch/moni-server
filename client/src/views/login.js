import React, { Component } from "react";
import "../styles/login.css";
import { Box, Heading } from "grommet";
import { TextField, Button, CircularProgress, Fade, Chip, Tooltip } from "@material-ui/core";
import { createAxiosInstance, saveToken, invalidateToken } from "../util";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Person, VerifiedUser } from "@material-ui/icons";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            credentials: {
                email: "",
                password: ""
            },
            loggingIn: false,
            showPassword: false
        };
    }

    componentDidMount() {
        invalidateToken();
    }

    handleValueChange = event => {
        const target = event.target;
        const obj = { ...this.state };
        obj.credentials[target.id] = target.value;

        this.setState(obj);
    };

    handleLogin = () => {
        const valid = this.state.credentials.email.trim() === "" && this.state.credentials.password === "";

        if (valid) return;

        const { email, password } = this.state.credentials;

        this.setState({ loggingIn: true });
        console.log("In here!");
        createAxiosInstance()
            .post("/api/admin/login", { email, password })
            .then(res => {
                console.log(res.data);
                const { token } = res.data;
                saveToken(token, token);
                this.setState({ loggingIn: false });
                this.props.history.push("/admin");
            })
            .catch(error => {
                console.log(error);
                this.setState({ loggingIn: false });
                alert(error.response ? error.response.data.error : "An error occurred please try again");
            });
    };

    render() {
        const handleClickShowPassword = () => {
            this.setState({ ...this.state, showPassword: !this.state.showPassword });
        };

        const handleMouseDownPassword = event => {
            event.preventDefault();
        };
        return (
            <div className="login-container">
                <Box className="form-container" direction="column" pad="medium" elevation="medium">
                    <img
                        style={{ alignSelf: "center", backgroundSize: "cover" }}
                        width="120"
                        height="28"
                        src={require("../assets/lm1.png")}
                    ></img>
                    <div className="input-container">
                        <TextField
                            id="email"
                            value={this.state.credentials.email}
                            margin="normal"
                            label="Email"
                            className="text-input"
                            placeholder="Email"
                            onChange={this.handleValueChange}
                            type="email"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <Person />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            id="password"
                            type={this.state.showPassword ? "text" : "password"}
                            value={this.state.credentials.password}
                            margin="normal"
                            label="Password"
                            className="text-input"
                            placeholder="Password"
                            onChange={this.handleValueChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            error={
                                this.state.credentials.password.length < 8 &&
                                this.state.credentials.password.trim() !== ""
                            }
                        />
                        <Button
                            style={{ marginTop: "15px", alignSelf: "flex-start" }}
                            variant="contained"
                            size="large"
                            color="primary"
                            onClick={this.handleLogin}
                            disabled={this.state.loggingIn}
                        >
                            {this.state.loggingIn ? (
                                <Fade
                                    in={this.state.loggingIn}
                                    style={{
                                        transitionDelay: this.state.loggingIn ? "100ms" : "0ms"
                                    }}
                                    unmountOnExit
                                >
                                    <CircularProgress size={24} />
                                </Fade>
                            ) : (
                                "Login"
                            )}
                        </Button>
                        <Tooltip title="privacy secured by [AI]" aria-label="security">
                            <Chip
                                icon={<VerifiedUser style={{ color: "white" }} />}
                                label="secured"
                                size="small"
                                style={{ color: "white", backgroundColor: "green", marginTop: "20px" }}
                            />
                        </Tooltip>
                    </div>
                </Box>
            </div>
        );
    }
}
