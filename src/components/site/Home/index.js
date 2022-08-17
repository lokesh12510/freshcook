import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid } from "@mui/material";
import { useSelector } from "react-redux";

import Banner from "./Banner";
import KitchenSlider from "./KitchenSlider";
import FoodList from "./FoodList";
import OrderSidebar from "./OrderSidebar";
import { BodyContainer } from "../../../utils/constants/Styles";

export const Home = (props) => {

  const locationState = useSelector((state) => state.location);
  const latitude = locationState.latitude || null;
  const longitude = locationState.longitude || null;

  const [cook, setCook] = useState("");
  const [foodType, setFoodType] = useState("");
  const [cookData, setCookData] = useState({});

  useEffect(() => {
    setCook("");
    setCookData({});
  }, [latitude, longitude]);
  useEffect(() => {
    //setFoodType("");
  }, [cook]);

  return (
    <>
      <Banner />
      <BodyContainer maxWidth="xl" sx={{ paddingBlock: "20px" }}>
        <Grid container spacing={{ xs: 1, md: 1 }}>
          <Grid item xs={12}>
            <KitchenSlider
              onSelectCook={setCook}
              onSelectCookData={setCookData}
              latitude={latitude}
              longitude={longitude}
              cook={cook}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={9}>
            <FoodList
              onSelectFoodType={setFoodType}
              onSelectCook={setCook}
              onSelectCookData={setCookData}
              latitude={latitude}
              longitude={longitude}
              cook={cook}
              foodType={foodType}
              cookData={cookData}
            />
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <OrderSidebar />
          </Grid>
        </Grid>
      </BodyContainer>
    </>
  );
};
