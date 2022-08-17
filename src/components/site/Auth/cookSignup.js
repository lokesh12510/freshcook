import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Alert,
} from "@mui/material";
import {
  Box,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { CloseBtn, StyledLink } from "../../../utils/constants/Styles";
import * as actions from "../../../utils/store/actions";
import * as SweetAlert from "../../ui/SweetAlert";
import * as authService from "../services/authService";
import url from "../url";
import Map from "../../ui/Map";
import FormEditor from "../../ui/FormEditor";
import * as commonHelper from "../../../utils/helpers/commonHelper";

const initialValues = {
  name: "",
  kitchen_name: "",
  mobile: "",
  email: "",
  city: "",
  address: "",
  description: "",
  profile: "",
  profile_file: "",
  radius_in_km: "",
  latitude: "",
  longitude: "",
  password: "",
};

const CookRegister = (props) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const popupnState = useSelector((state) => state.popup);
  const handleClose = () => {
    dispatch(actions.popupCookSignup(false));
  };

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => {
    setErrors("");
  }, [popupnState]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (e.target.name === "profile_file") {
      let files = e.target.files;
      setValues((p) => ({ ...p, ["profile_file"]: files[0] }));
      setValues((p) => ({ ...p, ["profile"]: URL.createObjectURL(files[0]) }));
    } else {
      setValues((p) => ({ ...p, [name]: value }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    authService
      .CookSignup(formData)
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
    if (status) {
      return errors[fieldName][0];
    }
  };

  return (
    <>
      <StyledDialog
        open={popupnState.cookSignup}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography component="div" variant="h6" gutterBottom>
            Cook Register
          </Typography>
          <Tabs value={1} fullWidth>
            <Tab
              label="Customer"
              sx={{ md: { minWidth: 200 } }}
              onClick={() => {
                dispatch(actions.popupCustSignup(true));
              }}
            />
            <Tab label="Cook" sx={{ md: { minWidth: 200 } }} />
          </Tabs>
        </DialogTitle>
        <StyledDialogContent>
          <Grid container component="main" style={{ minHeight: "100%" }}>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              component={Paper}
              elevation={0}
              square
            >
              <Box
                sx={{
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
                  component="form"
                  sx={{ mt: 1, mb: 3 }}
                  onSubmit={(e) => onSubmit(e)}
                  noValidate
                  autoComplete="off"
                >
                  <Grid container columnSpacing={1}>
                    {renderError("mismatch_credentials") && (
                      <Alert severity="error" style={{ width: "100%" }}>
                        {renderError("mismatch_credentials")}
                      </Alert>
                    )}
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        type="text"
                        label="Cook Name"
                        name="name"
                        value={values.name}
                        onChange={handleInputChange}
                        placeholder="Enter Cook Name"
                        helperText={renderError("name")}
                        error={renderError("name") && true}
                        margin="normal"
                        fullWidth
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        type="text"
                        label="Kitchen Name"
                        name="kitchen_name"
                        value={values.kitchen_name}
                        onChange={handleInputChange}
                        placeholder="Enter Kitchen Name"
                        helperText={renderError("kitchen_name")}
                        error={renderError("kitchen_name") && true}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
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
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
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
                    </Grid>
                  
                    <Grid item xs={12} sm={6} md={6}>
                      <TextField
                        type="text"
                        label="Mobile Number"
                        name="mobile"
                        value={values.mobile}
                        onChange={handleInputChange}
                        placeholder="Enter Mobile Number"
                        helperText={renderError("mobile")}
                        error={renderError("mobile") && true}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                 
                    <Grid item xs={12} sm={3} md={3}>
                      <TextField
                        type="text"
                        label="City"
                        name="city"
                        value={values.city}
                        onChange={handleInputChange}
                        placeholder="Enter City"
                        helperText={renderError("city")}
                        error={renderError("city") && true}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={3} md={3}>
                      <TextField
                        select
                        label="Radius (in km)"
                        name="radius_in_km"
                        value={values.radius_in_km}
                        onChange={handleInputChange}
                        helperText={renderError("radius_in_km")}
                        error={renderError("radius_in_km") && true}
                        margin="normal"
                        fullWidth
                      >
                        <MenuItem value="">-- Select --</MenuItem>
                        {commonHelper
                          .getRadiusOptions()
                          .map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <Map
                        label="Cook Location"
                        helperText={renderError("latitude") || renderError("longitude")}
                        value={{
                          latitude: values.latitude,
                          longitude: values.longitude,
                          address: searchLocation,
                          circleRadius: values.radius_in_km * 1000,
                        }}
                        onChange={(location) => {
                          setSearchLocation(location.address);
                          setValues((p) => ({
                            ...p,
                            ["latitude"]: location.latitude,
                          }));
                          setValues((p) => ({
                            ...p,
                            ["longitude"]: location.longitude,
                          }));
                        }}
                      />
                    </Grid>
                    {/* <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    type="file"
                    label="Profile"
                    name="profile_file"
                    onChange={handleInputChange}
                    helperText={renderError("profile_file")}
                    error={renderError("profile_file") && true}
                    inputProps={{ accept: "image/*" }}
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    fullWidth
                  />
                  {values.profile && (
                  <div>
                    <img src={values.profile} style={{ maxHeight: "100px" }} alt="image" />
                  </div>
                  )}
                  </Grid> */}
                  </Grid>

                  <Grid
                    container
                    justifyContent={"center"}
                    alignItems="center"
                    direction="column"
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mt: 3, mb: 2, minWidth: "300px" }}
                    >
                      Register
                    </Button>
                    <Grid item>
                      <Typography>
                        Already have an account?{" "}
                        <StyledLink to={url.Admin} variant="body2">
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

export default CookRegister;

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
