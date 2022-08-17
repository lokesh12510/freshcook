import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";

import * as foodService from "../services/foodService";
import url from "../url";
import DataTable from "../../ui/DataTable";
import * as SweetAlert from "../../ui/SweetAlert";
import Search from "./search";
import CheckAccess from "../Auth/checkAccess";
import { useSelector } from "react-redux";
import { PrimaryBtn, StyledBox, StyledContainer } from "../../../utils/constants/Styles";
import styled from "styled-components";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { EditIcon } from "../../../utils/constants/Icons";

import Switch from "react-switch";

export const Index = () => {
  const navigate = useNavigate();
  const [foodStatus,setFoodStatus] = useState();
  const [statusChange,setStatusChange] = useState(false);

  
  // DataTable
  const [tableValues, setTableValues] = useState({
    data: [],
    processing: true,
    totalRows: 0,
    page: 1,
    perPage: 10,
    filterText: "",
    search: {},
  });
  const authState = useSelector((state) => state.auth);

  const [chefNames,setChefNames]=useState('');
  const [rowID,setRowID] = useState();
  const handleChange=(value,row)=>{
    setRowID(row.id);
    setFoodStatus(value);
    setStatusChange(true);

  }
  const columns = [
    {
      name: "#",
      //selector: (row, index) => row.id,
      selector: (row, index) =>
        index + 1 + tableValues.perPage * (tableValues.page - 1),
      grow: 0,
      sortable: true,
    },
    {
      name: "Food Name",
      selector: (row) => row.food_name,
      sortable: true,
    },
    {
      name: "Food Type",
      selector: (row) => (row.food_type ? row.food_type.type : "--"),
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
    },
    {

      name: 'Status',
      selector: row => (row.status),
      cell:(row) => ([
        <CheckAccess request={['ROLE_CHEF']}>
          <Switch name="status" onChange={(checked)=>handleChange(checked,row)} value={row.status} checked={(foodStatus)?foodStatus:row.status} />
        </CheckAccess>,
       <CheckAccess request={['ROLE_ADMIN']}>
         <div>{(row.status)?'Active':'InActive'}</div>
       </CheckAccess>
      
      ]),
      sortable: true,
    },

    {
      name: "Actions",
      cell: (row) => [
        <CheckAccess request={["ROLE_ADMIN", "ROLE_CHEF"]}>
          <IconButton onClick={() => editFood(row.id)}>
            <EditIcon />
          </IconButton>
        </CheckAccess>,
        <CheckAccess request={["ROLE_ADMIN", "ROLE_CHEF"]}>
          <IconButton onClick={() => deleteFood(row.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </CheckAccess>,
      ],
      width: "20%",
    },
  ];

  useEffect(() => {
    if (authState.user.role == "ROLE_ADMIN") {
      getChefNames();
    }

  },[]);
  useEffect(()=>{
    if(statusChange && authState.user.role=='ROLE_CHEF')
    {
        updateFoodStatus(rowID,foodStatus);
    }
    },[statusChange]);

  useEffect(() => {
    getFoodList();
  }, [
    tableValues.page,
    tableValues.perPage,
    tableValues.filterText,
    tableValues.search,
  ]);

  const getFoodList = () => {
    const data = {
      page: tableValues.page,
      perPage: tableValues.perPage,
      filterText: tableValues.filterText,
    };
    Object.keys(tableValues.search).map((key) => {
      data[key] = tableValues.search[key];
      return data;
    });
    if (authState.user.role == "ROLE_CHEF") {
      data["chef_id"] = authState.user.id;
    }

    setTableValues((prevState) => ({
      ...prevState,
      ...{
        processing: true,
      },
    }));
    foodService
      .Index(data)
      .then((response) => {
        setTableValues((prevState) => ({
          ...prevState,
          ...{
            processing: false,
            data: response.data.list,
            totalRows: response.data.total,
          },
        }));
      })
      .catch((e) => {
        console.log(e);
      });

  };

  // Actions
  const editFood = (id) => {
    navigate(`${url.FoodEdit}/${id}`);
  };
  const deleteFood = (id) => {
    SweetAlert.deleteConfirm().then((result) => {
      if (result.isConfirmed) {
        foodService
          .Delete(id)
          .then((response) => {
            getFoodList();
            SweetAlert.successAlert("Food deleted successfully");
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  };
  const updateFoodStatus = async (orderId,foodstatus)=>{
    foodService.UpdateFoodStatus(orderId,foodstatus).then((response)=>{
      getFoodList();
      setStatusChange(false);

    }
        
    );


}
  const getChefNames =()=>
  {
    if(authState.user.role=='ROLE_ADMIN')
    {
      foodService.chefNameList().then((response)=>{
        setChefNames(response.data);
      });
    }
  };

  return (
    <>
      <StyledContainer maxWidth="lg">
        <StyledBox>
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
                startIcon={<AddCircleIcon size="large" />}
              >
                Add
              </PrimaryBtn>
            </CheckAccess>
          </Stack>
          <Divider style={{ marginBlock: 15 }} />
          <Grid container>
            <Grid item xs={12}>
              <Search
                setData={(search) => {
                  setTableValues((prevState) => ({
                    ...prevState,
                    ...{
                      search: search,
                    },
                  }));
                }}
                getData={chefNames}
              />
            </Grid>
          </Grid>
          <Row>
            <Col md={12}>
              <DataTable
                columns={columns}
                data={tableValues.data}
                striped
                pagination
                paginationServer
                paginationTotalRows={tableValues.totalRows}
                paginationDefaultPage={tableValues.page}
                onChangePage={(newPage) => {
                  setTableValues((prevState) => ({
                    ...prevState,
                    ...{
                      page: newPage,
                    },
                  }));
                }}
                onChangeRowsPerPage={(newPerPage, newPage) => {
                  setTableValues((prevState) => ({
                    ...prevState,
                    ...{
                      page: newPage,
                      perPage: newPerPage,
                    },
                  }));
                }}
                subHeader
                progressPending={tableValues.processing}
              />
            </Col>
          </Row>
        </StyledBox>
      </StyledContainer>
    </>
  );
};