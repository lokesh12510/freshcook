import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Divider, IconButton, Stack, Typography } from "@mui/material";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import StaticImages from "../../../../utils/constants/Images";
import { CartIcon, EditIcon } from "../../../../utils/constants/Icons";
import { PrimaryBtn, SectionBox, SectionHeader } from "../../../../utils/constants/Styles";
import { Theme } from "../../../../utils/constants/Theme";
import * as actions from "../../../../utils/store/actions";
import url from "../../url";

const Index = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);

  return (
    <SectionBox>
      <FlexDiv>
        <SectionHeader>
          <CartIcon /> Your Order
        </SectionHeader>
        <IconButton
          onClick={() => {
            dispatch(actions.cartPopup(true));
          }}
        >
          <EditIcon />
        </IconButton>
      </FlexDiv>
      <Divider style={{ marginBlock: 10 }} />

      {cartState.cartItems && cartState.cartItems.length > 0 ? (
        <>
          {/* <ButtonGroup fullWidth>
          <ButtonTabs>
            <Radio
              checked={false}
              size="small"
              value="a"
              name="radio-buttons"
              inputProps={{ "aria-label": "A" }}
              disableRipple
            />
            <div className="tabContent">
              <div className="tabTitle">Pick-Up</div>
              <div className="tabSubTitle">Free</div>
            </div>
          </ButtonTabs>
          <ButtonTabs>
            <Radio
              checked={true}
              size="small"
              value="a"
              name="radio-buttons"
              inputProps={{ "aria-label": "A" }}
              disableRipple
            />
            <div className="tabContent">
              <div className="tabTitle">Delivery</div>
              <div className="tabSubTitle"> ₹ 50.00</div>
            </div>
          </ButtonTabs>
        </ButtonGroup> */}
          {/* <Divider style={{ marginBlock: 10 }} /> */}
          {cartState.cartItems.map((item, index) => {
            return (
              <FlexDiv className="main" key={index}>
                <Typography className="cardItems">
                  {item.food_name || ""} x {item.u_quantity}
                </Typography>
                <Typography className="cardItems">
                  &#8377; {item.u_subtotal?.toFixed(2)}
                </Typography>
              </FlexDiv>
            );
          })}
          <Divider style={{ marginBlock: 10 }} />
          {/* <FlexDiv>
          <Typography>Delivery</Typography>
          <Typography>₹ 50.00</Typography>
        </FlexDiv> */}
          {/* <FlexDiv>
          <Typography>VAT</Typography>
          <Typography>₹ 10.00</Typography>
        </FlexDiv> */}
          <FlexDiv className="bg main">
            <Typography>Total</Typography>
            <Typography>
              {" "}
              &#8377; {cartState.cartTotalAmount?.toFixed(2)}
            </Typography>
          </FlexDiv>
          {/* <BtnGroups fullWidth style={{ marginBottom: 15 }}>
          <ButtonTabs alignItems="center">
            <Radio
              checked={false}
              size="small"
              value="a"
              name="radio-buttons"
              inputProps={{ "aria-label": "A" }}
            />
            <CashIcon />
            <div className="tabTitle">Cash</div>
          </ButtonTabs>
          <ButtonTabs alignItems="center">
            <Radio
              checked={true}
              size="small"
              value="b"
              name="radio-buttons"
              inputProps={{ "aria-label": "A" }}
            />
            <CardIcon />
            <div className="tabTitle">Card</div>
          </ButtonTabs>
        </BtnGroups> */}
          <PrimaryBtn
            fullWidth
            variant="contained"
            round
            onClick={() => navigate(url.OrderConfirm)}
          >
            Confirm Order
          </PrimaryBtn>{" "}
        </>
      ) : (
        <Stack alignItems={"center"} justifyContent="center" direction="column">
          <img src={StaticImages.EmptyCart} alt="cart" width={"100%"} />
          <Typography fontSize={"18"} variant="overline" fontWeight="600">
            Your cart is empty
          </Typography>
        </Stack>
      )}
    </SectionBox>
  );
};

export default Index;

const FlexDiv = styled.div`
  &.main {
    color: ${Theme.headerColor};
    & .cardItems {
      font-weight: 400;
      font-size: 14px;
    }
  }
  &.bg {
    background-color: #f8f8f8;
    padding: 10px;
    margin-block: 10px;
  }
  display: flex;
  margin-bottom: 10px;
  color: #7b7b7b;
  ${({ justifyContent }) =>
    justifyContent
      ? ` justify-content:${justifyContent}`
      : "justify-content:space-between"};
  ${({ alignItems }) =>
    alignItems ? `  align-items:${alignItems}` : " align-items:center"};
  & .MuiTypography-root {
    font-weight: 600;
    font-size: 14px;
  }
`;

const ButtonTabs = styled(Button)`
  ${({ alignItems }) =>
    alignItems ? `  align-items:${alignItems}` : " align-items:start"};
  background-color: #fff;
  justify-content: start;
  color: #000;
  padding: 10px;
  width: 100%;
  border: none;
  & .tabContent {
    display: flex;
    align-items: start;
    justify-content: start;
    flex-direction: column;
  }
  & .tabTitle {
    font-size: 16px;
    color: #000;
  }
  & .tabSubTitle {
    font-size: 13px;
    color: ${Theme.secondary.dark};
  }
  & svg {
    margin-inline: 5px;
  }
  &:hover {
    border: none;
  }
`;

const BtnGroups = styled(ButtonGroup)`
  & svg {
    width: 22px;
    height: 22px;
  }
`;
