import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "react-bootstrap";

import url from "../url";
import * as commonHelper from "../../../utils/helpers/commonHelper";
import * as SweetAlert from "../../ui/SweetAlert";
import FormEditor from "../../ui/FormEditor";
import Map from "../../ui/Map";
import * as cookService from "../services/cookService";
import { SectionBox, StyledContainer } from "../../../utils/constants/Styles";
import { Stack, Typography, Divider, Button } from "@mui/material";

const initialValues = {
  name: "",
  kitchen_name: "",
  mobile: "",
  email: "",
  city: "",
  address: "",
  description: "",
  profile: "",
  radius_in_km: "",
  latitude: "",
  longitude: "",
  password: "",
};

export const Form = (props) => {
  const navigate = useNavigate();

  const [searchLocation, setSearchLocation] = useState("");

  // Edit
  const params = useParams();
  const id = params.id || "";
  const [values, setValues] = useState(initialValues);
  const [image, setImage] = useState();
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (id > 0) {
      editCook();
    }
  }, []);

  // Form Errors
  const hasErrorFor = (fieldName) => {
    return !!errors[fieldName];
  };
  const renderError = (fieldName) => {
    let status = hasErrorFor(fieldName);
    if (status) {
      return errors[fieldName][0];
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (e.target.name === "profile_file") {
      let files = e.target.files;
      setImage(files[0]);
      setValues((p) => ({ ...p, ["profile_file"]: files[0] }));
      setValues((p) => ({ ...p, ["image"]: URL.createObjectURL(files[0]) }));
    } else {
      setValues((p) => ({ ...p, [name]: value }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    formData.append("kitchen_image", image);
    cookService
      .Store(formData)
      .then((response) => {
        if (id > 0) {
          SweetAlert.successAlert("Cook updated successfully");
        } else {
          SweetAlert.successAlert("Cook created successfully");
        }
        navigate(url.Cook);
      })
      .catch((e) => {
        let errordata = e.response.data.error[0];
        setErrors(errordata);
      });
  };

  const editCook = () => {
    cookService
      .Show(id)
      .then((response) => {
        setValues(response.data.data);
      })
      .catch((e) => {
        navigate(url.Cook);
      });
  };

  return (
    <StyledContainer maxWidth="lg">
      <SectionBox>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5" component="div" fontWeight="bold">
            Cook
          </Typography>
        </Stack>
        <Divider style={{ marginBlock: 15 }} />
        <form onSubmit={(e) => onSubmit(e)} style={{ paddingBlock: 15 }}>
          {errors.length > 0 ? <p> Validation Errors </p> : ""}

          <div className="form-group py-2">
            <label>Cook Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={values.name}
              onChange={handleInputChange}
              placeholder="Enter Name"
            />
            <span className="text-danger">{renderError("name")}</span>
          </div>

          <div className="form-group py-2">
            <label>Kitchen Name</label>
            <input
              type="text"
              className="form-control"
              id=""
              name="kitchen_name"
              value={values.kitchen_name}
              onChange={handleInputChange}
              placeholder="Enter Last Name"
            />
            <span className="text-danger">{renderError("kitchen_name")}</span>
          </div>

          <div className="form-group py-2">
            <label>Email</label>
            <input
              type="text"
              className="form-control"
              id="email"
              name="email"
              value={values.email}
              onChange={handleInputChange}
              placeholder="Enter Email"
            />
            <span className="text-danger">{renderError("email")}</span>
          </div>

          <div className="form-group py-2">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              onChange={handleInputChange}
              placeholder="Enter Password"
            />
            <span className="text-danger">{renderError("password")}</span>
          </div>

          <div className="form-group py-2">
            <label>Mobile</label>
            <input
              type="text"
              className="form-control"
              id=""
              name="mobile"
              value={values.mobile}
              onChange={handleInputChange}
              placeholder="Enter Mobile"
            />
            <span className="text-danger">{renderError("mobile")}</span>
          </div>

          <div className="form-group py-2">
            <label>Description</label>
            <FormEditor
              editorId="description"
              editorData={values.description}
              onEditorChange={(data) => {
                setValues((p) => ({ ...p, ["description"]: data }));
              }}
            />
          </div>

          <div className="form-group py-2">
            <label>Address</label>
            <input
              type="text"
              className="form-control"
              id=""
              name="address"
              value={values.address}
              onChange={handleInputChange}
              placeholder="Enter Address"
            />
            <span className="text-danger">{renderError("city")}</span>
          </div>

          <div className="form-group py-2">
            <label>City</label>
            <input
              type="text"
              className="form-control"
              id=""
              name="city"
              value={values.city}
              onChange={handleInputChange}
              placeholder="Enter City"
            />
            <span className="text-danger">{renderError("city")}</span>
          </div>

          <div className="form-group py-2">
            <label>Radius</label>
            <select
              name="radius_in_km"
              value={values.radius_in_km}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">-- Select --</option>
              {commonHelper.getRadiusOptions().map((option, index) => {
                return (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </select>
            <span className="text-danger">{renderError("radius_in_km")}</span>
          </div>

          <div className="form-group py-2">
            <Map 
              label="Cook Location"
              helperText={renderError("latitude") || renderError("longitude")}
              value={{
                latitude: values.latitude,
                longitude: values.longitude,
                address: searchLocation,
                circleRadius: values.radius_in_km * 1000,
              }}
              onChange={(location) => {
                setSearchLocation(location.address);
                handleInputChange({
                  target: {
                    name: "latitude",
                    value: location.latitude,
                  },
                });
                handleInputChange({
                  target: {
                    name: "longitude",
                    value: location.longitude,
                  },
                });
              }}
            />
            {/* <span className="text-danger">{}</span>
            <span className="text-danger">{}</span> */}
          </div>

          <div className="form-group py-2">
            <label>Profile</label>
            <input
              type="file"
              className="form-control"
              name="profile_file"
              accept="image/*"
              onChange={handleInputChange}
            />
            <span className="text-danger">{renderError("profile_file")}</span>
            {values.image && (
              <div className="form-group col-md-6 py-2">
                <img
                  src={values.image}
                  className="img-thumbnail"
                  style={{ maxHeight: "100px" }}
                  alt="image"
                />
              </div>
            )}
          </div>

          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </form>
      </SectionBox>
    </StyledContainer>
  );
};
