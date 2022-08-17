import {
  Box,
  Button,
  Container,
  Dialog,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Theme } from "./Theme";

const { primary, secondary, headerColor, color, grayText, borderColor } = Theme;

export const PrimaryBtn = styled(Button)`
  padding: 0.2rem 1.4rem;
  ${(props) => props.round === "true" && "border-radius : 50px"};
  border: 1px solid ${primary.main};
  min-width: 80px;
  ${({ variant }) => variant === "outlined" && "background-color:#fff"};

  &:hover {
    background-color: primary.main;
    opacity: 0.9;
    color: ${primary};
  }

  @media (max-width: 360px) {
    ${(props) => props.round === "true" && " padding: 1px 2px"};
    min-width: 70px;
  }
`;

export const TextBtn = styled(Button)`
  &.active {
    color: ${secondary.dark};
  }
`;

export const IconBtn = styled(IconButton)`
  object-fit: contain;
  &:hover {
    color: ${secondary.dark};
  }
`;

export const BodyContainer = styled(Container)`
  @media (max-width: 361px) {
    padding: 10px;
    & .d-xs-none {
      display: none;
    }
  }
  @media (min-width: 360px) {
    & .d-large-none {
      display: none;
    }
  }
`;

export const SectionBox = styled(Box)`
  padding: 15px;
  background-color: #fff;
  border-radius: 5px;
  @media (max-width: 360px) {
    padding: 10px;
  }
`;

export const SectionHeader = styled(Typography)`
  color: ${headerColor};
  font-size: 16px;
  font-weight: 600;
  display: flex;
  text-transform: capitalize;
  align-items: center;
  gap: 4px;
`;

export const HSliderHeader = styled(Typography)`
  color: ${headerColor};
  font-size: 16px;
  font-weight: 600;
  text-transform: capitalize;
  margin-left: 50px;
  @media (max-width: 360px) {
    margin-left: 2px;
  }
`;

export const TabBtn = styled(Tab)`
  & .mui-selected: {
    background-color: #fff;
    text-align: center;
  }
`;

export const LoadBtn = styled(Button)`
  background-color: #ebedf3;
  color: #000;
  border-radius: 50px;
  border: none;
  padding: 10px 50px;
  font-weight: bold;
`;

export const StyledFont = styled(Typography)`
  font-family: "Wendy One", sans-serif;
`;

export const StyledLink = styled(Link)`
  color: #000;
  &:hover {
    color: ${secondary.dark};
  }
`;

export const StyledContainer = styled(Container)`
  padding-block: 10px;
`;

export const FormTextField = styled(TextField)`
  margin-bottom: 25px;
`;

export const FormContainer = styled.div`
  padding-bottom: 25px;
`;

export const ImageUpload = styled(Stack)`
  & label {
    padding: 15px;
    border: 1px dashed ${primary.main};
    cursor: pointer;
    &:hover {
      background-color: ${primary.main}0f;
    },
  }
`;

export const StyledBox = styled(Box)`
  padding: 10px;
  background-color: #fff;
`;

export const CartItem = styled(Box)`
  padding: 5px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  border: 1px solid #eaeaea;
  border-radius: 5px;
  align-items: center;
  position: relative;
  margin-bottom: 12px;
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  & .closeBtn {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  & .foodName {
    font-size: 16px;
    font-weight: 600;
    color: ${headerColor};
    text-transform: capitalize;
  }
  & .foodIng {
    font-size: 13px;
    font-weight: 400;
    color: ${grayText};
  }
  & .foodPrice {
    font-size: 16px;
    color: ${secondary.dark};
    font-weight: 600;
  }
  & .foodDate {
    height: 100px;
    border-radius: 10px;
  }
  & .foodSession {
    width: 30px;
  }
  & .MuiButtonGroup-root {
    & .MuiButton-root:first-child {
      border-right: none;
    }

    & .countBox {
      border-radius: 5px;
    }
  }
`;

export const HScrollContainer = styled(Tabs)`
  & .MuiButtonBase-root {
    padding: 5px;
    justify-content: start;
  }
  & .Mui-selected {
    ${({ type }) =>
      type === "small"
        ? ` & .MuiButton-root {
      border: 1px solid ${borderColor};
    }`
        : ` & .MuiButton-root {
      border: 2px solid ${secondary.main};
    }`};
  }
  & .MuiTabs-indicator {
    display: none;
  }
`;

export const SliderItem = styled(Button)`
  border: 1px solid #eaeaea;
  border-radius: 5px;
  padding: 7px;
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: start;
  color: ${grayText};
  ${({ type }) =>
    type === "small"
      ? "min-width: 220px;min-height: 80px;"
      : "min-width: 350px;min-height: 100px;"};

  text-transform: initial;
  background-color: #fff;
  position: relative;
  & .shopImage {
    ${({ type }) => type === "small" && "width: 65px; height:65px"};
  }
  & .shopTitle {
    ${({ type }) =>
      type === "small" ? "font-size: 12px;" : "font-size: 16px"};

    color: ${headerColor};
    font-weight: 600;
    margin-bottom: 1px;
    text-transform: capitalize;
  }
  & .shopContent {
    ${({ type }) =>
      type === "small" ? "font-size: 11px;" : "font-size: 14px"};
    color: ${color};
    font-weight: 400;
  }
  & .shopRating {
    font-size: 14px;
    color: ${color};
  }
  & .priceText {
    font-size: 14px;
    color: ${secondary.dark};
  }

  & .react-stars: {
    & span {
      display:flex,
      align-items:center,
      justify-content:center,
    }
  }

  @media (max-width: 600px) {
    & .shopImage {
      width: 100%;
      height: 100%;
      max-width: 100px;
    }
    min-width: 240px;
    min-height: 100%;
  }
  @media (max-width: 361px) {
    & .shopTitle {
      font-size: 13px;
      color: ${headerColor};
      font-weight: 500;
    }
    & .shopContent {
      font-size: 11px;
      color: ${color};
      font-weight: 400;
    }

    & .d-xs-none {
      display: none;
    }
  
    & .shopImage {
      width: 100%;
      height: 100%;
      max-width: 40px;
      max-height: 40px;
    }
    min-width: 150px;
    min-height: 100%;
    border-radius: 6px;
  }
  @media (min-width: 991px) {
    
    ${({ type }) => type !== "small" && "min-height: 115px; "};
    & .shopImage {
      ${({ type }) =>
        type !== "small" &&
        " width: 100%; height: 100%;  max-width: 110px;   max-height: 112px;"};

    }
  }
`;

export const SliderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  text-transform: initial;
  padding-inline: 7px;
  @media (min-width: 360px) {
    padding-inline: 14px;
  }
`;

export const SliderCover = styled(Tab)`
  padding-right: 10px;
`;

export const CloseBtn = styled(IconButton)`
  position: absolute;
  right: 10px;
  ${({ VPosition }) => (VPosition ? `${VPosition}:10px` : "top:10px")}
`;

export const PriceText = styled(Typography)`
  color: ${secondary.dark};
  font-weight: bold;
`;

export const StyledDivider = styled(Divider)`
  margin-block: 15px;
`;

export const StyledDialog = styled(Dialog)`
  & .MuiDialogTitle-root {
    font-size: 1rem;
  }
`;

export const RatingIndicator = styled.div`
  width: auto;
  background-color: ${Theme.secondary.dark};
  color: #fff;
  display: inline-flex;
  padding: 1px 6px;
  gap: 3px;
  text-align: center;
  min-width: 40px;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  border-radius: 5px;
  height: 20px;
  & svg {
    & path {
      fill: #fff;
    }
  }
`;
