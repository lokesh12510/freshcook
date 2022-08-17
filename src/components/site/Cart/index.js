import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { CloseBtn } from "../../../utils/constants/Styles";
import Items from "./Items";
import Preview from "./Preview";
import * as actions from "../../../utils/store/actions";

const Cart = (props) => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);

  useEffect(() => {
  }, [cartState]);
  useEffect(() => {
    const { cartItemsCount, cartTotalAmount } = cartState.cartItems.reduce(
      ({ cartItemsCount, cartTotalAmount }, { u_subtotal }) => ({
        cartItemsCount: cartItemsCount + 1,
        cartTotalAmount: cartTotalAmount + u_subtotal,
      }), {
        cartItemsCount: 0,
        cartTotalAmount: 0,
      }
    );
    actions.cartItemsLocalSync(cartState.cartItems);
    dispatch(actions.cartUpdate({
      cartItemsCount: cartItemsCount,
      cartTotalAmount: cartTotalAmount,
    }));
  }, [cartState.cartItems]);

  const handleClose = () => {
    dispatch(actions.cartPopup(false));
  };

  return (
    <>
      <CartContainer
        open={cartState.popup}
        onClose={handleClose}
        maxWidth={"lg"}
        fullWidth
      >
        <DialogTitle>
          Cart
          <CloseBtn VPosition="top" onClick={handleClose}>
            <CloseIcon />
          </CloseBtn>
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <Items />
            </Grid>
            <Grid item xs={12}>
              <Preview />
            </Grid>
          </Grid>
        </DialogContent>
      </CartContainer>
    </>
  );
};

export default Cart;

const CartContainer = styled(Dialog)`
  & .MuiPaper-root {
    background-color: #f5f5f5;
    @media (max-width: 600px) {
      margin: 10px;
    }
  }
  & .MuiDialogTitle-root {
    font-size: 1.2rem;
  }
`;
