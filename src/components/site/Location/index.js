import React, { useEffect } from "react";
import { DialogTitle, useMediaQuery } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import { CloseBtn, StyledDialog } from "../../../utils/constants/Styles";
import * as commonHelper from "../../../utils/helpers/commonHelper";
import * as actions from "../../../utils/store/actions";
import Map from "./map";

const Location = (props) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const locationState = useSelector((state) => state.location);

  const isClosable = locationState.latitude && locationState.longitude;

  useEffect(() => {
  }, [locationState]);
  useEffect(() => {
    if (!locationState.latitude || !locationState.longitude) {
      dispatch(actions.locationPopup(true));
    }
  }, []);

  const handleClose = (event, reason) => {
    if (!isClosable && reason && reason == "backdropClick") {
      return;
    }
    dispatch(actions.locationPopup(false));
  };

  const currentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        if (position && position.coords) {
          const response = await commonHelper.getGeocode({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          if (
            response &&
            response.results[0] &&
            response.results[0].formatted_address
          ) {
            dispatch(
              actions.updateLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                address: response.results[0].formatted_address,
              })
            );
          } else {
            dispatch(
              actions.updateLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              })
            );
          }
          dispatch(actions.cartClear());
        }
      });
    } else {
      console.log("Sorry, browser does not support geolocation");
    }
  };

  return (
    <>
      <StyledDialog
        open={locationState.popup}
        onClose={handleClose}
        disableEscapeKeyDown={!isClosable}
        maxWidth={"sm"}
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down("md"))}
      >
        <DialogTitle>
          Choose Location
          {isClosable && (
            <CloseBtn VPosition="top" onClick={handleClose}>
              <CloseIcon />
            </CloseBtn>
          )}
        </DialogTitle>
        <Map
          value={{
            latitude: locationState.latitude,
            longitude: locationState.longitude,
            address: locationState.address,
          }}
          onChange={(location) => {
            dispatch(actions.updateLocation(location));
            dispatch(actions.cartClear());
          }}
          handleClose={handleClose}
          isClosable={isClosable}
          currentLocation={currentLocation}
        />
      </StyledDialog>
    </>
  );
};

export default Location;

