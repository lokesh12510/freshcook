import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import ReactStars from "react-rating-stars-component";

import {
  LocationIcon,
  StarIcon,
  StopwatchIcon,
} from "../../../../utils/constants/Icons";
import { SliderItem, SliderContent } from "../../../../utils/constants/Styles";

const Item = (props) => {
  const item = props.item || null;

  return (
    <SliderItem type="main">
      <img
        className="shopImage"
        src={item.image}
        alt=""
        width="100px"
        height={"90px"}
        style={{ objectFit: "cover" }}
      />
      <SliderContent>
        <Typography className="shopTitle" marginBottom="2px">
          {item.kitchen_name}
        </Typography>
        {item.foods && item.foods.length > 0 && (
          <Stack
            direction={"row"}
            alignItems="center"
            spacing={1}
            marginBottom="2px"
            className="d-xs-none"
          >
            <StopwatchIcon />

            <Typography className="shopContent">
              {item.foods && item.foods.length ? (
                <>
                  {item.foods
                    .map((item2, index2) => (
                      <React.Fragment key={index2}>{item2.type}</React.Fragment>
                    ))
                    .reduce((prev, curr) => [prev, ", ", curr])}
                </>
              ) : (
                <span>&nbsp;</span>
              )}
            </Typography>
          </Stack>
        )}
        <Stack
          direction={"row"}
          alignItems="center"
          spacing={1}
          marginBottom="1px"
          className="d-xs-none"
        >
          <LocationIcon />
          <Typography className="shopContent">
            {item.city}
            {item.distance >= 0 && " - " + item.distance?.toFixed(1) + " km"}
          </Typography>
        </Stack>
        <Stack direction={"row"} alignItems="center">
          <ReactStars
            className="ratingStar"
            count={5}
            isHalf={true}
            size={17}
            edit={false}
            value={+item.rating}
            activeColor="#ffd700"
          />

          <Typography className="shopRating d-xs-none" ml={1}>
            ({item.rating})
          </Typography>
        </Stack>
      </SliderContent>
    </SliderItem>
  );
};

export default Item;
