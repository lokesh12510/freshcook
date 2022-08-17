import React, { useEffect, useState } from "react";
import { Box, Grid, Stack, Tab, tabsClasses, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { FaPlusCircle } from "react-icons/fa";

import { CloseBtn, HScrollContainer, HSliderHeader, PriceText, SectionBox, SliderContent, SliderItem } from "../../../utils/constants/Styles";
import * as cartService from "../services/cartService";

const Related = (props) => {
  const { getFoodData } = props;

  const cartState = useSelector((state) => state.cart);

  const [cookData, setCookData] = useState({});
  const [relatedFoodList, setRelatedFoodList] = useState([]);

  useEffect(() => {
    if(cartState.previewId)
    {
      getRelatedItems(cartState.previewId);
    }
    else
    {
      setCookData({});
      setRelatedFoodList([]);
    }
  }, [cartState.previewId]);
  const getRelatedItems = (food_id) => {
    const data = {
      food_id: food_id,
    };
    cartService.relatedFoodList(data)
    .then((response) => {
      setCookData(response.data.cookData);
      setRelatedFoodList(response.data.foodList);
    }).catch((e) => {
      console.log(e);
    });
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {relatedFoodList && relatedFoodList.length > 0 && (
        <Grid container spacing={1}>
          {/* <Grid item md={12}>
            <h5 className="fw-bold">
              {(cookData && cookData.kitchen_name) || ""}
            </h5>
          </Grid> */}

          {/* food types */}
          {relatedFoodList.map((food_type, ft_index) => (
            <Grid item xs={12} md={6} key={ft_index}>
              <SectionBox>
                {food_type.foods && food_type.foods.length > 0 && (
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <HSliderHeader
                        variant="p"
                        fontWeight="500"
                        component={"div"}
                        gutterBottom
                      >
                        {food_type.type || ""}
                      </HSliderHeader>
                    </Grid>
                    <Box style={{ width: "100%" }}>
                      <HScrollContainer
                        type="small"
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons
                        aria-label="visible arrows tabs example"
                        sx={{
                          [`& .${tabsClasses.scrollButtons}`]: {
                            "&.Mui-disabled": { opacity: 0.3 },
                          },
                        }}
                      >
                        {food_type.foods.map((item, index) => {
                          return (
                            <Tab
                              label={
                                <>
                                  <SliderItem
                                    key={item.id}
                                    type="small"
                                    onClick={() => props.onSelect(item.id)}
                                  >
                                    <img
                                      src={item.image_url}
                                      alt="shop"
                                      width="100px"
                                      className="shopImage"
                                      height={"100px"}
                                      style={{ objectFit: "cover" }}
                                    />
                                    <SliderContent>
                                      <Typography className="shopTitle">
                                        {item.food_name}
                                      </Typography>
                                      <Stack
                                        direction={"row"}
                                        alignItems="center"
                                        spacing={1}
                                      >
                                        <></>
                                        <Typography className="shopContent">
                                          {" "}
                                          {item.food_ingredients &&
                                          item.food_ingredients.length ? (
                                            <>
                                              {item.food_ingredients
                                                .map((item2, index2) => (
                                                  <React.Fragment key={index2}>
                                                    {item2.ingredient}
                                                  </React.Fragment>
                                                ))
                                                .reduce((prev, curr) => [
                                                  prev,
                                                  ", ",
                                                  curr,
                                                ])}
                                            </>
                                          ) : (
                                            <span>&nbsp;</span>
                                          )}
                                        </Typography>
                                      </Stack>
                                      <Stack
                                        direction={"row"}
                                        alignItems="center"
                                        spacing={1}
                                      >
                                        <></>
                                        {item.price >= 0 && (
                                          <PriceText className="priceText">
                                            &#8377;{" "}
                                            {parseFloat(item.price).toFixed(2)}
                                          </PriceText>
                                        )}
                                      </Stack>
                                    </SliderContent>
                                    <CloseBtn VPosition="bottom">
                                      <FaPlusCircle
                                        size={22}
                                        color="red"
                                        role="button"
                                        onClick={() => getFoodData(item.id)}
                                      />
                                    </CloseBtn>
                                  </SliderItem>
                                </>
                              }
                            />
                          );
                        })}
                      </HScrollContainer>
                    </Box>
                  </Grid>
                )}
              </SectionBox>
            </Grid>
          ))}
          {/* food types */}
        </Grid>
      )}
    </>
  );
};

export default Related;