import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { Form, InputGroup } from "react-bootstrap";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import StaticImages from "../../../utils/constants/Images";
import {
  CartItem,
  CloseBtn,
  PrimaryBtn,
  RatingIndicator,
  SectionBox,
} from "../../../utils/constants/Styles";
import { StarIcon, TabIcons } from "../../../utils/constants/Icons";
import * as actions from "../../../utils/store/actions";
import * as cartService from "../services/cartService";
import * as commonHelper from "../../../utils/helpers/commonHelper";
import Related from "./Related";

import CloseIcon from "@mui/icons-material/Close";
import { Theme } from "../../../utils/constants/Theme";

const Preview = (props) => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);

  const [previewItems, setPreviewItems] = useState([]);
  const dayHourList = commonHelper.getDayHourList();
  const currentDayHour = commonHelper.getCurrentDayHour();

  useEffect(() => {
    if (cartState.previewId) {
      getFoodData(cartState.previewId);
    } else {
      setPreviewItems([]);
    }
  }, [cartState.previewId]);
  const getFoodData = (food_id) => {
    let checState = previewItems.some((x) => x.id === food_id);
    if (checState) {
      // if already exists
      return;
    }
    // check cart
    if (cartState.cartItems && cartState.cartItems.length > 0) {
      let checkCart = cartState.cartItems.some((x) => x.id === food_id);
      if (checkCart) {
        // if already exists
        return;
      }
    }

    const data = {
      food_id: food_id,
    };
    cartService
      .foodData(data)
      .then((response) => {
        let foodData = response.data.foodData;
        foodData.price = +foodData.price || 0;
        foodData.u_quantity = 1;
        foodData.u_subtotal = foodData.u_quantity * foodData.price;
        foodData.u_day = currentDayHour.day;
        foodData.u_hour = currentDayHour.hour;
        foodData.u_period = currentDayHour.period;
        foodData.u_date_time = commonHelper.calcCartDateTime(
          foodData.u_day,
          foodData.u_hour,
          foodData.u_period
        );
        setPreviewItems((p) => [...p, foodData]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const plusMinusItem = (food_id, type) => {
    let newItems = [...previewItems];
    let index = newItems.findIndex((x) => x.id === food_id);
    if (index !== -1 && newItems[index]) {
      // if exists
      let u_quantity = parseInt(newItems[index].u_quantity);
      let price = parseFloat(newItems[index].price);
      u_quantity = type === "minus" ? --u_quantity : ++u_quantity;
      if (u_quantity >= 1) {
        let u_subtotal = parseFloat(u_quantity * price);
        newItems[index].u_quantity = u_quantity;
        newItems[index].u_subtotal = u_subtotal;
        setPreviewItems(newItems);
      }
    }
  };
  const changeHandlerItem = (food_id, event) => {
    let newItems = [...previewItems];
    let index = newItems.findIndex((x) => x.id === food_id);
    if (index !== -1 && newItems[index]) {
      // if exists
      const { name, value } = event.target;
      newItems[index][name] = value;
      newItems[index]["u_date_time"] = commonHelper.calcCartDateTime(
        newItems[index].u_day,
        newItems[index].u_hour,
        newItems[index].u_period
      );
      setPreviewItems(newItems);
    }
  };
  const removeItem = (food_id) => {
    let newItems = [...previewItems];
    newItems = newItems.filter((x) => x.id !== food_id);
    setPreviewItems(newItems);
  };

  const orderNow = (food_id) => {
    let newItems = [...previewItems];
    let index = newItems.findIndex((x) => x.id === food_id);
    if (index !== -1 && newItems[index]) {
      // if exists
      dispatch(actions.cartItemAdd(newItems[index]));
      removeItem(food_id);
    }
  };

  return (
    <>
      {(!previewItems || previewItems.length < 1) &&
        (!cartState.cartItems || cartState.cartItems.length < 1) && (
          <SectionBox>
            <Stack
              alignItems={"center"}
              justifyContent="center"
              direction="column"
            >
              <img src={StaticImages.EmptyCart} alt="cart" width={"200px"} />
              <Typography fontSize={"18"} variant="overline" fontWeight="600">
                Your cart is empty
              </Typography>
            </Stack>
          </SectionBox>
        )}

      {/* preview items */}
      {previewItems && previewItems.length > 0 && (
        <Grid container>
          {previewItems.map((item, index) => (
            <Grid item xs={12} key={index}>
              <CartItem>
                <Grid container spacing={1} justifyContent="start">
                  <Grid item xs={1.5}>
                    <img src={item.image_url} alt="food" />
                  </Grid>
                  <Grid item xs={2.5}>
                    <Stack
                      direction={"column"}
                      alignItems="start"
                      justifyContent={"center"}
                      p={1}
                      spacing={"3px"}
                    >
                      <Stack direction={"row"} spacing={1} alignItems="center">
                        <Typography
                          fontWeight="bold"
                          variant="p"
                          component={"div"}
                          className="foodName"
                        >
                          {item.food_name}
                        </Typography>
                        <RatingIndicator>
                          <StarIcon style={{ fontSize: 15, zIndex: 22 }} />{" "}
                          {item.rating}
                        </RatingIndicator>
                        <Typography>(300)</Typography>
                      </Stack>
                      <Typography
                        variant="p"
                        component={"div"}
                        className="foodIng"
                      >
                        {item.food_ingredients &&
                        item.food_ingredients.length ? (
                          <>
                            {item.food_ingredients
                              .map((item2, index2) => (
                                <React.Fragment key={index2}>
                                  {item2.ingredient}
                                </React.Fragment>
                              ))
                              .reduce((prev, curr) => [prev, ", ", curr])}
                          </>
                        ) : (
                          <span>&nbsp;</span>
                        )}
                      </Typography>
                      {item.food_type && (
                        <Stack
                          direction="row"
                          alignItems={"center"}
                          spacing={"8px"}
                        >
                          <TabIcons type={item.food_type.type} />

                          <Typography
                            variant="p"
                            component={"div"}
                            className="foodType"
                          >
                            {item.food_type.type}
                          </Typography>
                        </Stack>
                      )}
                      <Typography variant="p" className="foodPrice">
                        &#8377; {item.price?.toFixed(2)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack
                      direction={"row"}
                      alignItems="center"
                      justifyContent={"center"}
                      style={{ height: "100%" }}
                    >
                      <InputGroup>
                        <Form.Select
                          className="foodDay"
                          name="u_day"
                          value={item.u_day}
                          onChange={(event) =>
                            changeHandlerItem(item.id, event)
                          }
                        >
                          {dayHourList.dayList &&
                            dayHourList.dayList.length > 0 &&
                            dayHourList.dayList.map((x, xi) => (
                              <option key={xi} value={x.name}>
                                {x.name}
                              </option>
                            ))}
                        </Form.Select>
                        <Form.Select
                          className="foodHour"
                          name="u_hour"
                          value={item.u_hour}
                          onChange={(event) =>
                            changeHandlerItem(item.id, event)
                          }
                        >
                          {dayHourList.hourList &&
                            dayHourList.hourList.length > 0 &&
                            dayHourList.hourList.map((x, xi) => (
                              <option key={xi} value={x.name}>
                                {x.name}
                              </option>
                            ))}
                        </Form.Select>
                        <Form.Select
                          className="foodSession"
                          name="u_period"
                          value={item.u_period}
                          onChange={(event) =>
                            changeHandlerItem(item.id, event)
                          }
                        >
                          {dayHourList.periodList &&
                            dayHourList.periodList.length > 0 &&
                            dayHourList.periodList.map((x, xi) => (
                              <option key={xi} value={x.name}>
                                {x.name}
                              </option>
                            ))}
                        </Form.Select>
                      </InputGroup>
                    </Stack>
                  </Grid>
                  <Grid item xs={2}>
                    <Stack
                      direction={"column"}
                      alignItems="center"
                      justifyContent={"center"}
                      style={{ height: "100%" }}
                      spacing={1}
                    >
                      <ButtonGroup
                        variant="text"
                        aria-label="outlined button group"
                      >
                        <Button
                          variant="text"
                          color="secondary"
                          onClick={() => plusMinusItem(item.id, "minus")}
                        >
                          <FaMinusCircle size={24} color={"secondary.dark"} />
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          fontWeight="bold"
                          className="countBox"
                        >
                          <Typography
                            fontWeight="bold"
                            color={"secondary.dark"}
                          >
                            {item.u_quantity >= 0 ? item.u_quantity : 0}
                          </Typography>
                        </Button>
                        <Button
                          variant="text"
                          color="secondary"
                          onClick={() => plusMinusItem(item.id, "plus")}
                        >
                          <FaPlusCircle size={24} color={"secondary.dark"} />
                        </Button>
                      </ButtonGroup>

                      <Typography fontWeight="bold" color={"secondary.dark"}>
                        &#8377; {item.u_subtotal?.toFixed(2)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid
                    item
                    xs={1.5}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: 10,
                    }}
                  >
                    <PrimaryBtn
                      fullWidth
                      variant="contained"
                      color="primary"
                      round="true"
                      style={{ whiteSpace: "nowrap" }}
                      size="large"
                      onClick={() => orderNow(item.id)}
                    >
                      Order Now
                    </PrimaryBtn>
                  </Grid>
                  <CloseBtn VPosition="top" onClick={() => removeItem(item.id)}>
                    <CloseIcon />
                  </CloseBtn>
                </Grid>
              </CartItem>
            </Grid>
          ))}
        </Grid>
      )}

      {/* related items */}

      <Grid container spacing={1}>
        <Grid item md={12}>
          <Related getFoodData={getFoodData} />
        </Grid>
      </Grid>
    </>
  );
};

export default Preview;
