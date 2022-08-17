import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as SweetAlert from "../../ui/SweetAlert";
import { useSelector, useDispatch } from "react-redux";
import * as orderConfirmService from "../services/orderConfirmService";
import * as actions from "../../../utils/store/actions";
import url from "../url";
import {
  CartItem,
  SectionBox,
  SectionHeader,
  StyledContainer,
  StyledDivider,
} from "../../../utils/constants/Styles";
import {
  Button,
  ButtonBase,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import LocationOnIcon from "@mui/icons-material/LocationOn";

export const Confirm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const locationState = useSelector((state) => state.location);
  const cartState = useSelector((state) => state.cart);
  const authState = useSelector((state) => state.auth);
  
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [orderDetail, setOrderDetail] = useState([]);
  
  const [basicOrderInfo, setBasicOrderInfo] = useState({
    address: "",
    payment_status: "1",
    payment_type: "Cash",
  });
  const [deliveryAddress, setFoodDeliveryAddress] = useState([]);
  useEffect(() => {
    getDeliveryAddress();
    setDeliveryLocation(locationState.address);
    setOrderDetail(cartState.cartItems);
  }, [cartState]);

  function getDeliveryAddress() {
    let user_id = authState.user.id;
    orderConfirmService.DeliveryAddressList(user_id).then((response) => {
      setFoodDeliveryAddress(response.data);
    });
  }



  const handleInputChange = (e) => {
    const { value } = e.target;
    setDeliveryLocation(value);
  };
  const handleDefaultAddresschange = (e) => {
    const {  value } = e.target;

    setDeliveryLocation(value);
  };

  const submitData = async (e) => {
    e.preventDefault();
    if(!deliveryLocation || deliveryLocation == "")
    {
      SweetAlert.warningAlert("Delivery Address cannot be empty");
      return false;
    }
    if(cartState.cartTotalAmount < 1)
    {
      SweetAlert.warningAlert("Order Total Cannot be 0");
      return false;
    }
    
    let addressData = {
      user_id: authState.user.id,
      delivery_address: deliveryLocation,
      delivery_latitude: locationState.latitude,
      delivery_longitude: locationState.longitude,
      default_flag: 1,
    };
    basicOrderInfo.address = deliveryLocation;
    
    let formData = new FormData();
    Object.keys(basicOrderInfo).forEach((key) => {
      formData.append(key, basicOrderInfo[key]);
    });
    formData.append("orderDetail", JSON.stringify(orderDetail));
    formData.append("addressData", JSON.stringify(addressData));
    orderConfirmService.Store(formData).then(() => {
      dispatch(actions.cartClear());
      SweetAlert.successAlert('Order placed successfully');
      navigate(url.Home);
    }).catch((e) => {
      console.log(e);
      SweetAlert.errorAlert(e.response.data);
    });
  };

  return (
    <>
      <StyledContainer>
        <SectionBox marginBottom="30px">
          <Grid container marginBottom={"20px"}>
            <Grid item xs={12}>
              <SectionHeader>Confirm Order</SectionHeader>
              <StyledDivider />
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>S.No</TableCell>
                      <TableCell align="center">Food Image</TableCell>
                      <TableCell align="center">Food Name</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="center">Price (₹)</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {orderDetail.map((data, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell align="center">
                          <img
                            src={data.image_url ? data.image_url : ""}
                            style={{ objectFit: "cover", height: "80px" }}
                            alt="item "
                          />
                        </TableCell>
                        <TableCell align="center">{data.food_name}</TableCell>
                        <TableCell align="center">{data.u_quantity}</TableCell>
                        <TableCell align="center">{data.u_subtotal}</TableCell>
                      </TableRow>
                    ))}
                    {orderDetail && orderDetail.length > 0 && (
                      <TableRow>
                        <TableCell align="right" colSpan={4}>
                          <Typography fontWeight={"bold"}>Total</Typography>{" "}
                        </TableCell>
                        <TableCell align="center">
                          <Typography fontWeight={"bold"}>
                            &#8377; {cartState.cartTotalAmount?.toFixed(2)}
                          </Typography>{" "}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          <Grid container spacing={2} paddingBottom={"20px"}>
            {deliveryAddress.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="p" fontWeight={"bold"} gutterBottom>
                  Note : Selecting any one of the below addresses will be
                  considered as Default Delivery Address
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                label={" Default Delivery Address"}
                id="default_address"
                name="default_address"
                fullWidth
                autoFocus
                color="secondary"
                value={deliveryLocation || ""}
                onChange={handleInputChange}
                placeholder="Enter Default Address"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">
                  Delivery Address
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={deliveryLocation}
                  onChange={handleDefaultAddresschange}
                >
                  {deliveryAddress.map((addressdata, index) => (
                    <FormControlLabel
                      style={{ padding: "10px", marginInline: "10px" }}
                      key={index}
                      value={addressdata.delivery_address || ""}
                      control={<Radio />}
                      label={addressdata.delivery_address}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="p" fontWeight={"bold"}>
              Note:The Delivery will be made to address that lies within radius
              of kitchen's mentioned in the order.Providing Wrong Delivery
              Address may lead to loss of payment.
            </Typography>
          </Grid>
          <Grid item xs={12} textAlign="end">
            {orderDetail && orderDetail.length > 0 && (
              <div className="mt-4">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={submitData}
                >
                  Confirm Order
                </Button>
              </div>
            )}
          </Grid>
        </SectionBox>
      </StyledContainer>
    </>
  );
};
