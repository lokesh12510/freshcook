import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
  Circle,
} from "@react-google-maps/api";
import { TextField } from "@mui/material";

import { constants } from "../../utils/constants";
import * as commonHelper from "../../utils/helpers/commonHelper";

const containerStyle = {
  width: "100%",
  height: "300px",
};

export default (props) => {
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
      <LoadScript
        id="location_load_script"
        googleMapsApiKey={constants.googleMapApi}
        libraries={constants.googleMapLibraries}
      >
        {typeof address !== "undefined" && (
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
              error={props.helperText && true}
              type="text"
              label={props.label || "Location"}
              helperText={props.helperText || ""}
              value={search}
              onChange={(e) => {
                const { value } = e.target;
                setSearch(value);
              }}
              style={{ width: "100%" }}
              margin="normal"
              fullWidth
            />
          </Autocomplete>
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

          {typeof circleRadius !== "undefined" && parseInt(circleRadius) > 0 && (
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
    </>
  );
};
