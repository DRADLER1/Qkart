import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  let details = {
    username: "",
    password: "",
    confirmPassword: "",
  };
  //HOOKS
  const [formData, setFormData] = useState(details);
  const [isLoading, setisLoading] = useState(false);

  let detailsHandler = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    setFormData({ ...formData, [name]: value });
  };
  const register = async (formData) => {
    let details = {
      username: formData.username,
      password: formData.password,
    };
    setisLoading(true);

    try {
      let res = await axios.post(`${config.endpoint}/auth/register`, details);
      enqueueSnackbar("Registered successfully", {
        variant: "success",
        autoHideDuration: 2000,
      });
      history.push("/login");
      
    } catch (e) {
      let message = e?.response?.data?.message;
      message
        ? enqueueSnackbar(message, { variant: "error", autoHideDuration: 2000 })
        : enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON", {
            variant: "error",
            autoHideDuration: 2000,
          });
    }
    setisLoading(false);
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  // let data = {
  //   username: formData.username,
  //   password: formData.password,
  //   confirmPassword: formData.confirmPassword,
  // };
  let data = formData;
  const validateInput = (data) => {
    let username = data.username;
    let password = data.password;
    let confirmPassword = data.confirmPassword;

    if (username !== "" && password !== "") {
      if (username.length < 6) {
        enqueueSnackbar("Username must be atleast 6 characters length", {
          variant: "warning",
          autoHideDuration: 2000,
        });
        return false;
      } else if (password.length < 6) {
        enqueueSnackbar("Password must be atleast 6 characters length", {
          variant: "warning",
          autoHideDuration: 2000,
        });
        return false;
      } else if (password !== confirmPassword) {
        enqueueSnackbar("Password do not match", {
          variant: "warning",
          autoHideDuration: 2000,
        });
        return false;
      } else {
        return true;
      }
    } else {
      let props = username == "" ?   "username" :  "password";
      enqueueSnackbar(`${props} is a required field`, {
        variant: "warning",
        autoHideDuration: 2000,
      });
      return false; 
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons = {true} />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            onChange={detailsHandler}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={detailsHandler}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            onChange={detailsHandler}
          />

          {isLoading ? (
            <div className="ui">
              <CircularProgress />
            </div>
          ) : (
            <Button
              className="button"
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                if (validateInput(data)) {
                  register(data);
                  
                } else {
                  validateInput(data);
                }
              }}
            >
              Register Now
            </Button>
          )}

          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="/login">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
