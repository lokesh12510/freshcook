import { Button, MenuItem, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";

const initialValues = {
  delivery_status: "",
  payment_status: "",
};

const deliveryStatus = [
  {
    value: "0",
    label: "Delivery Status",
  },
  {
    value: "1",
    label: "Order Confirmed",
  },
  {
    value: "2",
    label: "Food Packed",
  },
  {
    value: "3",
    label: "Delivered",
  },
  {
    value: "4",
    label: "Cancelled",
  },
];

const paymentStatus = [
  {
    value: "0",
    label: "Payment Status",
  },
  {
    value: "1",
    label: "Paid",
  },
  {
    value: "2",
    label: "Pending",
  },
];

const Search = (props) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleSearch = () => {
    props.setData(values);
  };
  const handleReset = () => {
    setValues((prevState) => ({ ...prevState, ...initialValues }));
    props.setData(initialValues);
  };

  return (
    <SearchContainer>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        <TextField
          id="delivery_status"
          name="delivery_status"
          label="Delivery Status"
          variant="outlined"
          size="small"
          select
          value={values.delivery_status}
          onChange={handleChange}
          style={{ minWidth: 350 }}
        >
          {deliveryStatus.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="payment_status"
          name="payment_status"
          label="Payment Status"
          variant="outlined"
          size="small"
          select
          value={values.payment_status}
          onChange={handleChange}
          style={{ minWidth: 350 }}
        >
          {paymentStatus.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={handleSearch}
        >
          Search
        </Button>
        <Button
          variant="outlined"
          color="info"
          type="button"
          onClick={handleReset}
        >
          Reset
        </Button>
      </Stack>
    </SearchContainer>
  );
};

export default Search;

const SearchContainer = styled.div`
  padding-block: 20px;
`;
