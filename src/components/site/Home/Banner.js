import React from "react";
import {
  Box,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";

import StaticImages from "../../../utils/constants/Images";
import { Theme } from "../../../utils/constants/Theme";
import * as actions from "../../../utils/store/actions";

const Banner = () => {
  const dispatch = useDispatch();
  const locationState = useSelector((state) => state.location);

  return (
    <BannerContainer maxWidth="xxl" src={StaticImages.Banner}>
      <BannerContent>
        <Box marginBottom={"20px"}>
          <HeroText color={Theme.secondary.dark}>
            Order Food Online From
          </HeroText>
          <HeroText>the Best Homecook</HeroText>
        </Box>

        <LocationTextField
          variant="outlined"
          placeholder="Choose Location"
          value={locationState.address || ""}
          onClick={() => {
            dispatch(actions.locationPopup(true));
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon style={{ color: "#fff" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <ArrowDropDownIcon style={{ color: "#fff" }} />
              </InputAdornment>
            ),
          }}
        />
      </BannerContent>
    </BannerContainer>
  );
};

export default Banner;

const BannerContainer = styled(Container)`
  min-height: 350px;
  background-color: #e6e6e6;
  background-image: url(${(props) => props.src});
  background-size: cover;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  &:after {
    content: "";
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #00000024;
  }
  @media (max-width: 600px) {
    min-height: 260px;
  }
`;

const BannerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 1;
  padding-top: 100px;
  padding-bottom: 25px;
  @media (max-width: 600px) {
    font-size: 14px;
    padding-top: 90px;
    width: 100%;
    padding-bottom: 5px;
  }
`;

const HeroText = styled(Typography)`
  font-size: 45px;
  text-align: center;
  margin-bottom: 0;
  line-height: 1;
  font-family: "Wendy One", sans-serif;
  @media (max-width: 600px) {
    font-size: 22px;
  }
`;

const LocationTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    min-width: 550px;
  }
  @media (max-width: 600px) {
    & .MuiOutlinedInput-root {
      min-width: 100%;
    }
  }
  & .MuiOutlinedInput-input {
    color: white;
    padding: 9px 14px;
  }
  & .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    color: white;
    border-radius: 50px;
    background-color: #ffffff35;
    top: 0;
  }
  & :hover.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border-color: ${Theme.secondary.main};
  }
  & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: ${Theme.secondary.main};
  }
  & fieldset {
    & legend {
      display: none;
    }
  }
  @media (max-width: 600px) {
    & .MuiOutlinedInput-input {
      padding: 7.5px 0px;
    }
    width: 100%;
  }
`;
