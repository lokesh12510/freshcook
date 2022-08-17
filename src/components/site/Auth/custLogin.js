import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Dialog, DialogContent, FormControl, FormHelperText, Alert } from "@mui/material";
import { Box, Checkbox, FormControlLabel, Grid, Paper, Tab, Tabs, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ArrowForward as ArrowForwardIcon, Close as CloseIcon } from "@mui/icons-material";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import StaticImages from "../../../utils/constants/Images";
import { CloseBtn, StyledLink } from "../../../utils/constants/Styles";
import * as actions from "../../../utils/store/actions";
import ReCaptcha from "../../ui/ReCaptcha";
import * as authService from "../services/authService";
import url from "../url";

const initialValues = {
  email: "",
  password: "",
  recaptcha: "",
  attempts: 0,
};

export default (props) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullWidth = useMediaQuery(theme.breakpoints.down("sm"));

  const popupnState = useSelector((state) => state.popup);
  const handleClose = () => {
    dispatch(actions.popupCustLogin(false));
  };

  const loginAttempts = useSelector((state) => state.loginAttempts);
  useEffect(() => {
    setValues((p) => ({ ...p, ["attempts"]: loginAttempts }));
  }, [loginAttempts]);

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState("");

  const recaptchaRef = React.createRef();

  useEffect(() => {
    setErrors("");
  }, [popupnState]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if(recaptchaRef.current)
    {
      const recaptchaValue = recaptchaRef.current.getValue();
      if(recaptchaValue)
      {
        recaptchaRef.current.reset();
        values.recaptcha = recaptchaValue;
      }
    }
    authService.Login(values)
    .then((response) => {
      dispatch({ type: "RESET_LOGIN_ATTEMPTS" });
      const token = response.data.token;
      const user = response.data.user;
      dispatch(actions.authLogin(token, user));
      dispatch(actions.popupCustLogin(false));
    }).catch((e) => {
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
    if(status)
    {
      return errors[fieldName][0];
    }
  };

  return (
    <>
      <StyledDialog
        open={popupnState.custLogin}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <StyledDialogContent>
          <Grid container component="main" style={{ minHeight: "100%" }}>
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
            <Grid
              item
              xs={12}
              sm={8}
              md={6}
              component={Paper}
              elevation={0}
              square
            >
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* <img
                  src={StaticImages.LogoDark}
                  width="100px"
                  height={"100px"}
                  alt="logo"
                  style={{ marginBottom: 10 }}
                /> */}
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
                    LOGIN as
                  </Typography>
                  <Tabs value={0} centered fullWidth>
                    <Tab
                      label="Customer Login"
                      sx={{ md: { minWidth: 200 } }}
                    />
                    <Button
                      component={StyledLink}
                      color="secondary"
                      to={url.Admin}
                      target="_blank"
                      endIcon={<ArrowForwardIcon />}
                      style={{ md: { minWidth: 200 } }}
                    >
                      Cook Login
                    </Button>
                  </Tabs>
                </Box>

                <Box
                  component="form"
                  sx={{ mt: 1 }}
                  onSubmit={(e) => onSubmit(e)}
                  noValidate
                  autoComplete="off"
                >
                  {renderError("mismatch_credentials") && (
                    <Alert severity="error" style={{ width: "100%" }}>
                      {renderError("mismatch_credentials")}
                    </Alert>
                  )}
                  <TextField
                    type="text"
                    label="Email Address"
                    name="email"
                    value={values.email}
                    onChange={handleInputChange}
                    placeholder="Enter User Name"
                    helperText={renderError("email")}
                    error={renderError("email") && true}
                    margin="normal"
                    fullWidth
                    autoFocus
                  />
                  <TextField
                    type="password"
                    name="password"
                    label="Password"
                    value={values.password}
                    onChange={handleInputChange}
                    placeholder="Enter Password Here"
                    helperText={renderError("password") || renderError("mismatch_credentials")}
                    error={(renderError("password") || renderError("mismatch_credentials")) && true}
                    margin="normal"
                    fullWidth
                  />

                  {values.attempts > 3 && (
                    <FormControl fullWidth>
                      <ReCaptcha
                        size="normal"
                        ref={recaptchaRef}
                        onChange={(value) => {
                        }}
                      />
                      <FormHelperText error>
                        {renderError("recaptcha")}
                      </FormHelperText>
                    </FormControl>
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
                    Login
                  </Button>

                  <Grid
                    container
                    justifyContent={"center"}
                    alignItems="center"
                    direction="column"
                    spacing={1}
                  >
                    <Grid item>
                      <Typography>
                        Don't have an account?{" "}
                        <StyledLink
                          to="#"
                          variant="body2"
                          onClick={() => {
                            dispatch(actions.popupCustSignup(true));
                          }}
                        >
                          Sign Up
                        </StyledLink>
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      <StyledLink
                        to="#" 
                        variant="body2"
                        onClick={() => {
                          dispatch(actions.popupCustForgotPwd(true));
                        }}
                      >
                        Forgot password?
                      </StyledLink>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </StyledDialogContent>

        <CloseBtn VPosition="top" onClick={handleClose}>
          <CloseIcon />
        </CloseBtn>
      </StyledDialog>
    </>
  );
};

const StyledDialog = styled(Dialog)`
  & .MuiPaper-root {
    width: 95%;
    margin: 0px;
    & .MuiBox-root {
      margin-right: 10px;
      margin-left: 10px;
    }
  }
`;

const StyledDialogContent = styled(DialogContent)`
  padding: 0;
`;
