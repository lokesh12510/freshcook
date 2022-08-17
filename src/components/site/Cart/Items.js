import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Grid, Stack, Typography } from "@mui/material";
import { Form, InputGroup } from "react-bootstrap";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import {
  CartItem,
  PrimaryBtn,
  RatingIndicator,
} from "../../../utils/constants/Styles";
import { StarIcon, TabIcons } from "../../../utils/constants/Icons";
import * as actions from "../../../utils/store/actions";
import * as commonHelper from "../../../utils/helpers/commonHelper";

const Items = (props) => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);

  const dayHourList = commonHelper.getDayHourList();

  const plusMinusItem = (food_id, type) => {
    if (type === "plus") {
      dispatch(actions.cartItemQtyPlus({ id: food_id }));
    } else if (type === "minus") {
      dispatch(actions.cartItemQtyMinus({ id: food_id }));
    }
  };
  const changeHandlerItem = (food_id, event) => {
    let index = cartState.cartItems.findIndex((x) => x.id === food_id);
    if (index !== -1 && cartState.cartItems[index]) {
      // if exists
      const { name, value } = event.target;
      let curr_item = cartState.cartItems[index];
      curr_item[name] = value;
      let u_date_time = commonHelper.calcCartDateTime(
        curr_item.u_day,
        curr_item.u_hour,
        curr_item.u_period
      );
      dispatch(
        actions.cartItemUpdate({
          id: food_id,
          [name]: value,
          u_date_time: u_date_time,
        })
      );
    }
  };
  const removeItem = (food_id) => {
    dispatch(actions.cartItemDelete({ id: food_id }));
  };

  return (
    <>
      {cartState.cartItems && cartState.cartItems.length > 0 && (
        <Grid container>
          {cartState.cartItems.map((item, index) => (
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
                          <StarIcon style={{ fontSize: 15, zIndex: 22 }} /> {item.rating}
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
                          className="countBox"
                          fontWeight="bold"
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
                    xs={1.6}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: 10,
                    }}
                  >
                    <PrimaryBtn
                      fullWidth
                      variant="outlined"
                      color="primary"
                      round="true"
                      style={{ whiteSpace: "nowrap", fontSize: 14 }}
                      size="large"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove Order
                    </PrimaryBtn>
                  </Grid>
                </Grid>
              </CartItem>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default Items;
