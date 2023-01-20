import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory, Link } from "react-router-dom";
import { display } from "@mui/system";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Search, SentimentDissatisfied } from "@mui/icons-material";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  let logOut = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("balance");
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => history.push("/")}
        >
          Back to explore
        </Button>
      ) : localStorage.getItem("username") ? (
        <>
        {children}
          <Stack spacing={3} direction="row" alignItems="center">
            <Stack spacing={1} direction="row" alignItems="center">
              <Avatar
                alt={localStorage.getItem("username")}
                src="public/avatar.png"
              />
              <h4>{localStorage.getItem("username")}</h4>
            </Stack>

            <Button className="button" variant="contained" onClick={logOut}>
              Logout
            </Button>
          </Stack>
        </>
      ) : (
        <>
          {children}

          <Stack spacing={3} direction="row">
            <Button
              className="explore-button"
              variant="text"
              onClick={() => history.push("/login")}
            >
              login
            </Button>
            <Button
              className="button"
              variant="contained"
              onClick={() => history.push("/register")}
            >
              Register
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
};

export default Header;
