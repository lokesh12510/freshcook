import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import * as authService from "../services/authService";
import ReCaptcha from "../../ui/ReCaptcha";
import * as actions from "../../../utils/store/actions";
import url from "../url";
import { Alert, Container, Tab, Tabs } from "@mui/material";
import StaticImages from "../../../utils/constants/Images";

import styled from "styled-components";
import { StyledLink } from "../../../utils/constants/Styles";

const initialValues = {
  email: "",
  password: "",
  recaptcha: "",
  attempts: 0,
};

export const Login = () => {
  let navigate = useNavigate();

  const dispatch = useDispatch();
  const loginAttempts = useSelector((state) => state.loginAttempts);
  useEffect(() => {
    setValues((p) => ({ ...p, ["attempts"]: loginAttempts }));
  }, [loginAttempts]);

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState("");

  const recaptchaRef = React.createRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (recaptchaRef.current) {
      const recaptchaValue = recaptchaRef.current.getValue();
      if (recaptchaValue) {
        recaptchaRef.current.reset();
        values.recaptcha = recaptchaValue;
      }
    }
    authService
      .Login(values)
      .then((response) => {
        dispatch({ type: "RESET_LOGIN_ATTEMPTS" });
        const token = response.data.token;
        const user = response.data.user;
        dispatch(actions.authLogin(token, user));
        navigate(url.Dashboard);
      })
      .catch((e) => {
        dispatch({ type: "UPDATE_LOGIN_ATTEMPTS" });
        let error = e.response.data.error[0];
        setErrors(error);
      });
  };

  const hasErrorFor = (fieldName) => {
    return !!errors[fieldName];
  };

  const renderError = (fieldName) => {
    let status = hasErrorFor(fieldName);
    if (status) {
      return errors[fieldName][0];
    }
  };

  return (
    <StyledLoginContainer maxWidth="lg" style={{ minHeight: "95vh" }}>
      <Grid container component="main" style={{ minHeight: "100%" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          sx={{
            backgroundImage: `url(${StaticImages.AuthBg})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={0} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={StaticImages.LogoDark}
              width="120px"
              alt="logo"
              style={{ marginBottom: 20 }}
            />
            <Box
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                marginBottom: "20px",
              }}
            >
              <Typography
                component="div"
                variant="h6"
                gutterBottom
                textAlign="center"
              >
                LOGIN
              </Typography>
            </Box>
            <Box
              component="form"
              noValidate
              sx={{ mt: 1 }}
              onSubmit={(e) => onSubmit(e)}
            >
              {renderError("mismatch_credentials") && (
                <Alert severity="error" style={{ width: "100%" }}>
                  {renderError("mismatch_credentials")}
                </Alert>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={values.email}
                onChange={handleInputChange}
                placeholder="Enter User Name"
                autoComplete="email"
                autoFocus
                helperText={renderError("email")}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={values.password}
                onChange={handleInputChange}
                placeholder="Enter Password Here"
                autoComplete="current-password"
                helperText={renderError("password")}
              />
              
              {values.attempts > 3 && (
                <div className="form-group py-2">
                  <label>ReCaptcha</label>
                  <ReCaptcha
                    size="normal"
                    ref={recaptchaRef}
                    onChange={(value) => {
                    }}
                  />
                  <span className="text-danger">
                    {renderError("recaptcha")}
                  </span>
                </div>
              )}
              
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              
              <Grid container justifyContent="center">
                <Grid item>
                  <Typography>
                    Don't have an account?{" "}
                    <StyledLink
                      to="/"
                      variant="body2"
                      onClick={() => {
                        dispatch(actions.popupCookSignup(true));
                      }}
                    >
                      Sign Up
                    </StyledLink>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </StyledLoginContainer>
  );
};

const theme = createTheme();

export default function SignInSide() {
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   console.log({
  //     email: data.get("email"),
  //     password: data.get("password"),
  //   });
  // };

  return <ThemeProvider theme={theme}></ThemeProvider>;
}

const StyledLoginContainer = styled(Container)`
  display: flex;
  align-items: center;
`;
