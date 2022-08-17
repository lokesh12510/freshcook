import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";
import { Container } from "react-bootstrap";

import * as foodService from "../services/foodService";
import * as commonService from "../services/commonService";
import url from "../url";
import * as SweetAlert from "../../ui/SweetAlert";
import FormEditor from "../../ui/FormEditor";

import Switch from "react-switch";
import {
  FormContainer,
  FormTextField,
  ImageUpload,
  PrimaryBtn,
  SectionBox,
  StyledContainer,
} from "../../../utils/constants/Styles";
import {
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CheckAccess from "../Auth/checkAccess";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";

const initialValues = {
  food_name: "",
  food_type_id: "",
  short_description: "",
  price: "",
  status: false,
  image_url: "",
  image_file: "",
};

export const Form = (props) => {
  let navigate = useNavigate();
  const authState = useSelector((state) => state.auth);

  // Edit
  const params = useParams();
  const id = params.id || "";

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState([]);
  const [ingredientDetails, setIngredientDetails] = useState([
    { ingredient: "" },
  ]);

  const [foodTypeList, setFoodTypeList] = useState([]);

  useEffect(() => {
    if (id > 0) {
      editFood();
    }
    getFoodTypeList();
  }, []);

  const editFood = () => {
    foodService
      .Show(id)
      .then((response) => {
        setValues(response.data.FoodDetails);

        setIngredientDetails(response.data.IngredientDetails);
      })
      .catch((e) => {
        console.log(e);
        navigate(url.Food);
      });
  };

  const getFoodTypeList = async () => {
    foodService
      .foodTypeList()
      .then((response) => {
        //creating object from another object eg:{value:1,label:php}
        setFoodTypeList(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (e.target.name == "image_file") {
      let files = e.target.files;
      setValues((p) => ({ ...p, ["image_file"]: files[0] }));
      setValues((p) => ({
        ...p,
        ["image_url"]: URL.createObjectURL(files[0]),
      }));
    } else {
      setValues((p) => ({ ...p, [name]: value }));
    }
  };

  const addMoreInput = (e, index) => {
    const { name, value } = e.target;
    const list = [...ingredientDetails];
    list[index][name] = value;
    setIngredientDetails(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...ingredientDetails];
    if (list.length > 1) {
      list.splice(index, 1);
      setIngredientDetails(list);
    } else {
      alert("Atleast One row Present");
    }
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setIngredientDetails([...ingredientDetails, { ingredient: "" }]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    formData.append("ingredientDetails", JSON.stringify(ingredientDetails));
    formData.append("chef_id", authState.user.id);
    foodService
      .Store(formData)
      .then((response) => {
        if (id > 0) {
          SweetAlert.successAlert("Food updated successfully");
        } else {
          SweetAlert.successAlert("Food created successfully");
        }
        navigate(url.Food);
      })
      .catch((e) => {
        let errors = e.response.data.error[0];
        setErrors(errors);
      });
  };

  // Form Errors
  const hasErrorFor = (fieldName) => {
    return !!errors[fieldName];
  };
  const renderError = (fieldName) => {
    let status = hasErrorFor(fieldName);
    if (status) {
      return (
        <Typography variant="overline" component="div">
          <ErrorOutlineIcon fontSize="small" /> {errors[fieldName][0]} !
        </Typography>
      );
    }
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
            Food
          </Typography>
          <CheckAccess request={["ROLE_CHEF"]}>
            <PrimaryBtn
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => navigate(url.FoodAdd)}
              startIcon={<RemoveRedEyeIcon size="large" />}
            >
              View
            </PrimaryBtn>
          </CheckAccess>
        </Stack>
        <Divider style={{ marginBlock: 15 }} />
        <form onSubmit={(e) => onSubmit(e)} style={{ paddingBlock: 15 }}>
          {errors.length > 0 ? <p> Validation Errors </p> : ""}

          <FormTextField
            error={renderError("food_name") && true}
            label="Food Name"
            variant="outlined"
            size="small"
            id="food_name"
            name="food_name"
            value={values.food_name}
            onChange={handleInputChange}
            fullWidth
            placeholder="Enter Food Name"
            helperText={renderError("food_name")}
          />

          <FormTextField
            error={renderError("food_type_id") && true}
            label="Food Type"
            variant="outlined"
            size="small"
            id="food_type_id"
            name="food_type_id"
            value={values.food_type_id}
            onChange={handleInputChange}
            fullWidth
            select
            placeholder="Enter Food Type"
            helperText={renderError("food_type_id")}
          >
            {foodTypeList.map((item, index) => (
              <MenuItem key={index} value={item.id}>
                {" "}
                {item.type}
              </MenuItem>
            ))}
          </FormTextField>

          <FormTextField
            error={renderError("price") && true}
            label="Price"
            variant="outlined"
            size="small"
            id="price"
            name="price"
            value={values.price}
            onChange={handleInputChange}
            placeholder="Enter Price"
            fullWidth
            helperText={renderError("price")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">&#8377;</InputAdornment>
              ),
            }}
          />
          <FormContainer>
            <FormEditor
              editorId="description"
              editorData={values.short_description}
              onEditorChange={(data) => {
                setValues((p) => ({ ...p, ["short_description"]: data }));
              }}
            />
          </FormContainer>
          <FormContainer>
            <Stack direction={"row"} alignItems="center" justifyContent="start">
              <label style={{ marginRight: "2rem" }}>Status</label>

              <Switch
                name="status"
                onChange={(checked) => {
                  setValues((p) => ({ ...p, ["status"]: checked }));
                }}
                checked={values.status}
              />
            </Stack>
          </FormContainer>

          <FormContainer>
            <ImageUpload>
              <label htmlFor="contained-button-file">
                <input
                  style={{ display: "none" }}
                  name="image_file"
                  accept="image/*"
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={handleInputChange}
                />
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload
                </Button>
                <span className="text-danger">{renderError("image_file")}</span>
                {values.image_url && (
                  <div className="form-group col-md-6 py-2">
                    <Typography>Preview</Typography>
                    <Divider style={{ marginBlock: 10 }} />
                    <img
                      src={values.image_url}
                      className="img-thumbnail"
                      style={{ maxHeight: "100px" }}
                      alt="upload"
                    />
                  </div>
                )}
              </label>
            </ImageUpload>
            <Typography fontWeight={"bold"} mt="10px">
              <ErrorOutlineIcon /> Note:Image with good resolution(700*700) is
              preferred.Images with bad resolution will not be displayed with
              good quality.{" "}
            </Typography>
          </FormContainer>

          <Divider style={{ marginBlock: 20 }} />
          <FormContainer>
            <Typography variant="h6" component="p" gutterBottom>
              Ingredients Details:
            </Typography>

            {ingredientDetails.map((input, index) => {
              return (
                <Stack
                  key={index}
                  direction="row"
                  alignItems="center"
                  justifyContent="start"
                  spacing={2}
                  style={{ marginBottom: 15 }}
                >
                  <TextField
                    error={
                      renderError(
                        "ingredientDetails." + index + ".ingredient"
                      ) && true
                    }
                    label="Ingredients"
                    variant="outlined"
                    size="small"
                    name="ingredient"
                    value={input.ingredient}
                    onChange={(e) => addMoreInput(e, index)}
                    placeholder="Enter Ingredient"
                    helperText={renderError(
                      "ingredientDetails." + index + ".ingredient"
                    )}
                    style={{ minWidth: 400 }}
                  />
                  <Button
                    variant="text"
                    color="error"
                    type="button"
                    onClick={() => handleRemoveClick(index)}
                    startIcon={<DeleteIcon />}
                  >
                    Remove
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    type="button"
                    startIcon={<AddBoxIcon />}
                    onClick={handleAddClick}
                  >
                    Add
                  </Button>
                </Stack>
              );
            })}
          </FormContainer>
          <Divider style={{ marginBlock: 15 }} />

          <Button
            type="submit"
            color="primary"
            variant="contained"
            size="large"
          >
            Submit
          </Button>
        </form>
      </SectionBox>
    </StyledContainer>
  );
};
