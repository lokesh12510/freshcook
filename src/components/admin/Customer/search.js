import { MenuItem, Stack, TextField, Button } from "@mui/material";
import React, { useState } from "react";

const initialValues = {
  name: "",
  status: "",
};

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
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        <TextField
          id="name"
          name="name"
          label="Name"
          type="text"
          value={values.name}
          onChange={handleChange}
          placeholder="Name"
          variant="outlined"
          size="small"
          style={{ minWidth: 350 }}
        />
        <TextField
          id="status"
          name="status"
          label="Status"
          variant="outlined"
          size="small"
          select
          value={values.status}
          onChange={handleChange}
          style={{ minWidth: 350 }}
        >
          <MenuItem key={0} value={"select Status"}>
            select Status
          </MenuItem>
          <MenuItem key={1} value={1}>
            Active
          </MenuItem>
          <MenuItem key={2} value={'inactive'}>
            InActive
          </MenuItem>
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
    </>
  );
};

export default Search;
