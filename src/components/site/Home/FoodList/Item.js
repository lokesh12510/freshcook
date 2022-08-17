import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import { LoadBtn } from "../../../../utils/constants/Styles";
import { RatingIndicator } from "../../../../utils/constants/Styles";
import { Theme } from "../../../../utils/constants/Theme";
import * as homeService from "../../services/homeService";
import * as actions from "../../../../utils/store/actions";

const initialValues = {
  items: [],
  loading: false,
  totalRows: 0,
  page: 1,
  perPage: 6,
  totalPages: 1,
};

export default (props) => {
  const dispatch = useDispatch();
  const [listValues, setListValues] = useState(initialValues);

  useEffect(() => {
    setListValues({ ...initialValues });
  }, [props]);
  useEffect(() => {
    getFoodList();
  }, [props, listValues.page]);
  const getFoodList = () => {
    const data = {
      page: listValues.page,
      perPage: listValues.perPage,
      latitude: props.latitude,
      longitude: props.longitude,
      cook: props.cook,
      food_type: props.foodType,
    };
    if (props.search) {
      Object.keys(props.search).map((key) => {
        data[key] = props.search[key];
        return data;
      });
    }
    if (!data.food_type) {
      return;
    }
    setListValues((prevState) => ({
      ...prevState,
      ...{
        loading: true,
      },
    }));
    homeService
      .FoodList(data)
      .then((response) => {
        setListValues((prevState) => ({
          ...prevState,
          ...{
            loading: false,
            items:
              prevState.page > 1
                ? [...prevState.items, ...response.data.list]
                : response.data.list,
            totalRows: response.data.total,
            totalPages: Math.ceil(response.data.total / prevState.perPage),
          },
        }));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      {listValues.items && listValues.items.length > 0 ? (
        <>
          <FoodContainer container spacing={{ xs: 2 }}>
            {listValues.items.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FoodCard>
                  {item.user && item.user.image && (
                    <div className="popularFlag">
                      <img src={item.user.image} height="40px" alt="" />
                    </div>
                  )}
                  <CardMedia
                    image={item.image_url}
                    alt="food"
                    component="img"
                    height="220"
                  />
                  <CardContent>
                    <Grid container justifyContent="space-between">
                      <Grid item xs={9} md={7} lg={9} xl={8}>
                        <Typography
                          variant="p"
                          component="div"
                          className="foodName"
                        >
                          {item.food_name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={2}
                          marginBottom="10px"
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

                        <Stack direction={"row"} spacing={1}>
                          <RatingIndicator>
                            <StarIcon style={{ fontSize: 15 }} /> {item.rating}
                          </RatingIndicator>
                          {/* <Typography>(300)</Typography> */}
                        </Stack>
                      </Grid>
                      <Grid item textAlign={"end"}>
                        <PriceText gutterBottom>
                          &#8377; {(+item.price || 0)?.toFixed(2)}
                        </PriceText>
                        <IconButton
                          onClick={() => {
                            dispatch(actions.cartPopup(true));
                            dispatch(
                              actions.cartUpdate({ previewId: item.id })
                            );
                          }}
                        >
                          <AddCircleIcon
                            className="addToCart"
                            color="primary"
                            size="large"
                          />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </FoodCard>
              </Grid>
            ))}
          </FoodContainer>

          {listValues.loading ? (
            <CircularProgress>
              <span className="visually-hidden">Loading...</span>
            </CircularProgress>
          ) : (
            <>
              {listValues.totalPages !== listValues.page && (
                <Grid container justifyContent={"center"}>
                  <Grid item>
                    <LoadBtn
                      onClick={() => {
                        setListValues((prevState) => ({
                          ...prevState,
                          ...{
                            page: prevState.page + 1,
                          },
                        }));
                      }}
                    >
                      Load More
                    </LoadBtn>
                  </Grid>
                </Grid>
              )}
            </>
          )}
        </>
      ) : (
        <div className="text-center">
          <p className="p-5">No results found</p>
        </div>
      )}
    </>
  );
};

const FoodContainer = styled(Grid)`
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 20px;
`;

const FoodCard = styled(Card)`
  filter: drop-shadow(5px 5px 5px rgba(159, 159, 159, 0.25));
  height: 100%;
  box-shadow: none;
  padding: 0;
  & .MuiCardMedia-root {
    height: 200px;
  }
  position: relative;
  & .popularFlag {
    position: absolute;
    top: 0;
    left: 0;
  }
  & .MuiCardContent-root {
    padding: 10px;
    box-shadow: none;
    & .foodName {
      font-size: 16px;
      font-weight: 600;
    }
  }

  & .addToCart {
    width: 1.5em;
    height: 1.5em;
  }
`;

const PriceText = styled(Typography)`
  color: ${Theme.secondary.dark};
  font-size: 16px;
  font-weight: 600;
`;
