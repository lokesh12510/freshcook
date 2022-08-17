import { SvgIcon } from "@mui/material";

import { ReactComponent as TwitterIcon } from "../../assets/img/twitter.svg";
import { ReactComponent as FacebookIcon } from "../../assets/img/facebook.svg";
import { ReactComponent as InstagramIcon } from "../../assets/img/instagram.svg";
import { ReactComponent as YoutubeIcon } from "../../assets/img/youtube.svg";
import { ReactComponent as StopWatchIcon } from "../../assets/img/stopwatch.svg";
import { ReactComponent as Location } from "../../assets/img/location.svg";
import { ReactComponent as Star } from "../../assets/img/star.svg";
import { ReactComponent as Breakfast } from "../../assets/img/breakfast.svg";
import { ReactComponent as Lunch } from "../../assets/img/lunch.svg";
import { ReactComponent as Dinner } from "../../assets/img/dinner.svg";
import { ReactComponent as Snacks } from "../../assets/img/snacks.svg";
import { ReactComponent as Popular } from "../../assets/img/popularFlag.svg";
import { ReactComponent as Cart } from "../../assets/img/cart.svg";
import { ReactComponent as Edit } from "../../assets/img/edit.svg";
import { ReactComponent as Cash } from "../../assets/img/cash.svg";
import { ReactComponent as Card } from "../../assets/img/card.svg";
import styled, { css } from "styled-components";

const svgStyles = ({ height, color, hover }) => {
  return css`
    height: ${height || "22px"};
    vertical-align: inherit;
    & path {
      fill: ${color || "#000"};
    }
    &:hover path {
      fill: ${hover || "currentColor"};
    }
  `;
};

export const StyledTwitterIcon = styled(TwitterIcon)`
  ${(props) => svgStyles(props)}
`;
export const StyledFacebookIcon = styled(FacebookIcon)`
  ${(props) => svgStyles(props)}
`;
export const StyledInstagramIcon = styled(InstagramIcon)`
  ${(props) => svgStyles(props)}
`;
export const StyledYoutubeIcon = styled(YoutubeIcon)`
  ${(props) => svgStyles(props)}
`;
export const StyledSnacksIcon = styled(Snacks)`
  ${(props) => svgStyles(props)}
`;
export const StyledLunchIcon = styled(Lunch)`
  ${(props) => svgStyles(props)}
`;
export const StyledDinnerIcon = styled(Dinner)`
  ${(props) => svgStyles(props)}
`;
export const StyledBreakfastIcon = styled(Breakfast)`
  ${(props) => svgStyles(props)}
`;
export const StopwatchIcon = () => <StopWatchIcon />;
export const LocationIcon = () => <Location />;
export const StarIcon = () => <Star />;
export const PopularFlag = () => <Popular />;
export const CartIcon = () => <Cart />;
export const EditIcon = () => <Edit />;
export const CashIcon = () => <Cash />;
export const CardIcon = () => <Card />;

export const TabIcons = ({ type }) => {
  console.log(type);

  switch (type) {
    case "Breakfast":
      return <StyledBreakfastIcon />;
    case "Lunch":
      return <StyledLunchIcon />;
    case "Dinner":
      return <StyledDinnerIcon />;
    case "Snacks":
      return <StyledSnacksIcon />;

    default:
      return <StyledBreakfastIcon />;
  }
};
