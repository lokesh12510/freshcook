import React, { useEffect, useState } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  TextField,
} from "@mui/material";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
  Circle,
} from "@react-google-maps/api";
import styled from "styled-components";

import { constants } from "../../../utils/constants";
import * as commonHelper from "../../../utils/helpers/commonHelper";

const containerStyle = {
  width: "100%",
  height: "320px",
};
const Map = (props) => {
  const [searchBox, setSearchBox] = useState(null);
  const [search, setSearch] = useState("");
  const position = {
    lat: parseFloat(props.value.latitude) || constants.googleMapPosition.lat,
    lng: parseFloat(props.value.longitude) || constants.googleMapPosition.lng,
  };
  const address = props.value.address;
  const circleRadius = props.value.circleRadius;
  const onChange = props.onChange;

  useEffect(() => {
    if (address) {
      setSearch(address);
    }
  }, [props]);

  return (
    <>
      <StyledDialogContent>
        <DialogContentText>
          <LoadScript
            id="location_load_script"
            className="mapCanvas"
            googleMapsApiKey={constants.googleMapApi}
            libraries={constants.googleMapLibraries}
          >
            {" "}
            {typeof address !== "undefined" && (
              <Grid
                container
                direction="row"
                alignItems={"center"}
                justifyContent="space-between"
                spacing={1}
                marginBottom="5px"
              >
                <Grid item xs={12} md={8} flexGrow={1}>
                  <Autocomplete
                    style={{ width: "100%" }}
                    onLoad={(ref) => {
                      setSearchBox(ref);
                    }}
                    onPlaceChanged={() => {
                      const place = searchBox.getPlace();
                      onChange({
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng(),
                        address: place.formatted_address,
                      });
                    }}
                  >
                    <TextField
                      style={{ width: "100%" }}
                      type="text"
                      autoFocus
                      margin="dense"
                      label="Your Location"
                      fullWidth
                      variant="standard"
                      value={search}
                      onChange={(e) => {
                        const { value } = e.target;
                        setSearch(value);
                      }}
                    />
                  </Autocomplete>
                </Grid>
                <Grid item xs={12} md={4} textAlign="center">
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ fontSize: "11px" }}
                    onClick={() => props.currentLocation()}
                  >
                    Use Current Location
                  </Button>
                </Grid>
              </Grid>
            )}
            <GoogleMap
              id="location_google_map"
              mapContainerStyle={containerStyle}
              center={position}
              zoom={10}
            >
              <Marker
                onLoad={(ref) => {
                }}
                position={position}
                draggable={true}
                onDragEnd={async (e) => {
                  onChange({
                    latitude: e.latLng.lat(),
                    longitude: e.latLng.lng(),
                  });
                  const response = await commonHelper.getGeocode({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                  });
                  if (
                    response &&
                    response.results[0] &&
                    response.results[0].formatted_address
                  ) {
                    onChange({
                      latitude: e.latLng.lat(),
                      longitude: e.latLng.lng(),
                      address: response.results[0].formatted_address,
                    });
                  }
                }}
              />

              {typeof circleRadius !== "undefined" &&
                parseInt(circleRadius) > 0 && (
                  <Circle
                    onLoad={(ref) => {
                    }}
                    center={position}
                    radius={parseInt(circleRadius)}
                    draggable={false}
                    editable={false}
                    options={{
                      strokeColor: "#FF0000",
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: "#FF0000",
                      fillOpacity: 0.35,
                      clickable: false,
                      zIndex: 1,
                    }}
                  />
                )}
            </GoogleMap>
          </LoadScript>
        </DialogContentText>
      </StyledDialogContent>
    </>
  );
};

export default Map;

const StyledDialogContent = styled(DialogContent)`
  @media (max-width: 600px) {
    padding: 0;
    & .MuiGrid-root {
      padding: 10px;
    }
    & #location_google_map {
      height: 300px;
    }
  }
`;
