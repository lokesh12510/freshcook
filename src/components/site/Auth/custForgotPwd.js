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
  resetPwdUrl:window.location.origin+'/CustResetPwd'
};

export default (props) => {
  const dispatch = useDispatch();
  // const theme = useTheme();
  // const fullWidth = useMediaQuery(theme.breakpoints.down("sm")); 
  const popupnState = useSelector((state) => state.popup);
  const handleClose = () => {
    dispatch(actions.popupCustForgotPwd(false));
  };

  // const loginAttempts = useSelector((state) => state.loginAttempts);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState("");
  const [success_msg, SetSuccessMsg] = useState("");

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
    authService.CustomerForgetPwd(values)
    .then((response) => {
      setValues({ ...values, ['email']: "" });
      SetSuccessMsg('We have e-mailed your password reset link!');
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
        open={popupnState.custForgotPwd}
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
                  Forget Password
                  </Typography>
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

                    {success_msg ? (
                    <Alert severity="success" style={{ width: "100%" }}>
                      {success_msg}
                    </Alert> ) : "" }
              

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
                 

                

                 
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Send Password Reset Link
                  </Button>

               
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
