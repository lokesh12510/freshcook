import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Dialog, DialogContent } from "@mui/material";
import { Box, Grid, Paper, Tab, Tabs, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import StaticImages from "../../../utils/constants/Images";
import { CloseBtn, StyledLink } from "../../../utils/constants/Styles";
import * as actions from "../../../utils/store/actions";
import * as SweetAlert from "../../ui/SweetAlert";
import * as authService from "../services/authService";
import url from "../url";

const initialValues = {
  name: "",
  email: "",
  contact_number: "",
  password: "",
};

export default (props) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullWidth = useMediaQuery(theme.breakpoints.down("sm"));

  const popupnState = useSelector((state) => state.popup);
  const handleClose = () => {
    dispatch(actions.popupCustSignup(false));
  };

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    setErrors("");
  }, [popupnState]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    authService.CustomerSignup(formData)
    .then((response) => {
      dispatch(actions.popupCustLogin(true));
    })
    .catch((e) => {
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
        open={popupnState.custSignup}
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
                    Register as
                  </Typography>
                  <Tabs value={0} centered fullWidth>
                    <Tab label="Customer" sx={{ md: { minWidth: 200 } }} />
                    <Tab
                      label="Cook"
                      sx={{ md: { minWidth: 200 } }}
                      onClick={() => {
                        dispatch(actions.popupCookSignup(true));
                      }}
                    />
                  </Tabs>
                </Box>
                      
                <Box
                  component="form"
                  sx={{ mt: 1 }}
                  onSubmit={(e) => onSubmit(e)}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    type="text"
                    label="Name"
                    name="name"
                    value={values.name}
                    onChange={handleInputChange}
                    placeholder="Enter Name"
                    helperText={renderError("name")}
                    error={renderError("name") && true}
                    margin="normal"
                    fullWidth
                    autoFocus
                  />
                   <TextField
                    type="text"
                    label="Mobile Number"
                    name="contact_number"
                    value={values.contact_number}
                    onChange={handleInputChange}
                    placeholder="Enter Mobile Number"
                    helperText={renderError("contact_number")}
                    error={renderError("contact_number") && true}
                    margin="normal"
                    fullWidth
                  />
                  <TextField
                    type="text"
                    label="Email Address"
                    name="email"
                    value={values.email}
                    onChange={handleInputChange}
                    placeholder="Enter Email"
                    helperText={renderError("email")}
                    error={renderError("email") && true}
                    margin="normal"
                    fullWidth
                  />
                   <TextField
                    type="password"
                    name="password"
                    label="Password"
                    value={values.password}
                    onChange={handleInputChange}
                    placeholder="Enter Password Here"
                    helperText={renderError("password")}
                    error={renderError("password") && true}
                    margin="normal"
                    fullWidth
                  />
                 
               

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Register
                  </Button>

                  <Grid container justifyContent={"center"}>
                    {/* <Grid item xs>
                      <Link to="#" variant="body2">
                        Forgot password?
                      </Link>
                    </Grid> */}
                    <Grid item>
                      <Typography>
                        Already have an account?{" "}
                        <StyledLink
                          to="#"
                          variant="body2"
                          onClick={() => {
                            dispatch(actions.popupCustLogin(true));
                          }}
                        >
                          Login
                        </StyledLink>
                      </Typography>
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
