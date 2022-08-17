import React, { useEffect, useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle, Grid, Tab, Tabs, Typography, Stack, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { Close as CloseIcon, HighlightOff } from "@mui/icons-material";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import ReactStars from "react-rating-stars-component";

import { CloseBtn } from "../../../utils/constants/Styles";
import { CartItem } from "../../../utils/constants/Styles";
import * as actions from "../../../utils/store/actions";
import { constants } from "../../../utils/constants";
import * as SweetAlert from "../../ui/SweetAlert";
import DataTable from "../../ui/DataTable";
import * as myorderService from "../services/myOrdersService";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MyOrders = () => {
  const dispatch = useDispatch();

  const popupnState = useSelector((state) => state.popup);
  const authState = useSelector((state) => state.auth);
  const handleClose = () => {
    dispatch(actions.popupMyOrders(false));
  };
  
  const [tabValue, setTabValue] = useState(0);
  const [tableValues, setTableValues] = useState({
    data: [],
    processing: true,
    totalRows: 0,
    page: 1,
    perPage: 10,
    filterText: "",
    search: {},
  });
  const [tableValuesFutureOrder, setTableValuesFutureOrder] = useState({
    data: [],
    processing: true,
    totalRows: 0,
    page: 1,
    perPage: 10,
    filterText: "",
    search: {},
  });
  const [tableValuesActiveOrder, setTableValuesActiveOrder] = useState({
    data: [],
    processing: true,
    totalRows: 0,
    page: 1,
    perPage: 10,
    filterText: "",
    search: {},
  });
  
  useEffect(() => {
    getOrders();
  }, [
    popupnState.myOrders,
    tableValues.page,
    tableValues.perPage,
    tableValues.filterText,
    tableValues.search,
    tableValuesFutureOrder.page,
    tableValuesFutureOrder.perPage,
    tableValuesFutureOrder.filterText,
    tableValuesFutureOrder.search,
    tableValuesActiveOrder.page,
    tableValuesActiveOrder.perPage,
    tableValuesActiveOrder.filterText,
    tableValuesActiveOrder.search,
  ]);
  const getOrders = () => {
    const data = {
      page: tableValues.page,
      perPage: tableValues.perPage,
      filterText: tableValues.filterText,
      pageFuture: tableValuesFutureOrder.page,
      perPageFuture: tableValuesFutureOrder.perPage,
      filterTextFuture: tableValuesFutureOrder.filterText,
      pageActive: tableValuesActiveOrder.page,
      perPageActive: tableValuesActiveOrder.perPage,
      filterTextActive: tableValuesActiveOrder.filterText,
    };
    Object.keys(tableValues.search).map((key) => {
      data[key] = tableValues.search[key];
      return data;
    });
    setTableValues((prevState) => ({
      ...prevState,
      ...{
        processing: true,
      },
    }));
    if(!popupnState.myOrders || !authState.isLoggedIn)
    {
      return;
    }
    myorderService.getOrders(data).then((response) => {
      setTableValues((prevState) => ({
        ...prevState,
        ...{
          processing: false,
          data: response.data.list,
          totalRows: response.data.total,
        },
      }));
      setTableValuesFutureOrder((prevState) => ({
        ...prevState,
        ...{
          processing: false,
          data: response.data.futureOrder,
          totalRows: response.data.futuretotal,
        },
      }));
      setTableValuesActiveOrder((prevState) => ({
        ...prevState,
        ...{
          processing: false,
          data: response.data.activeOrder,
          totalRows: response.data.activetotal,
        },
      }));
    });
  };
  
  const changeFoodRating = (value, rowData) => {
    const food_id = rowData.food.id;
    let data = {
      food_id: food_id,
      rating: value,
    };
    myorderService.updateFoodRating(data).then((response) => {
      getOrders();
    });
  };
  const changeKitchenRating = (value, rowData) => {
    const kitchen_id = rowData.food.chef_id;
    let data = {
      kitchen_id: kitchen_id,
      rating: value,
    };
    myorderService.updateKitchenRating(data).then((response) => {
      getOrders();
    });
  };
  const CancelOrder = (rowData) => {
    SweetAlert.swalAlert({
      html: 'Are you sure want to cancel this order?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if(result.isConfirmed)
      {
        let data = {
          id: rowData.id,
        };
        myorderService.CancelOrder(data).then((response) => {
          getOrders();
        });
      }
    });
  };
  
  const columns = [
    {
      name: "#",
      selector: (row, index) =>
        index + 1 + tableValues.perPage * (tableValues.page - 1),
      grow: 0,
      sortable: true,
    },
    {
      name: "Order ID",
      selector: (row) => row.order.order_reference_number,
      sortable: true,
    },

    {
      name: "Food Name",
      selector: (row) => (row.food.food_name ? row.food.food_name : ""),
      cell: (row) => [
        <Grid xs={12}>
          <CartItem className="tableItem">
            <Grid container>
              <Grid xs={3}>
                <img
                  src={row.food.image_url}
                  alt="food"
                  width={"70px"}
                  height="70px"
                />
              </Grid>
              <Grid xs={6}>
                <Stack
                  direction={"column"}
                  alignItems="start"
                  justifyContent={"start"}
                  p={1}
                  spacing={"3px"}
                >
                  <Typography component={"div"}>
                    {row.food.food_name}
                  </Typography>

                  <ReactStars
                    count={5}
                    isHalf={true}
                    onChange={(startvalue) => changeFoodRating(startvalue, row)}
                    size={24}
                    value={+row.food.rating}
                    activeColor="#ffd700"
                  />
                </Stack>
              </Grid>
            </Grid>
          </CartItem>
        </Grid>,
      ],

      sortable: true,
      width: "20rem",
    },
    {
      name: "Kitchen Name",
      selector: (row) =>
        row.food.user.kitchen_name ? row.food.user.kitchen_name : "",

      cell: (row) => [
        <Grid>
          <CartItem>
            <Grid container>
              <Grid row xs={12}>
                <Typography component={"div"}>
                  {row.food.user.kitchen_name}
                </Typography>
              </Grid>
              <Grid row xs={12}>
                <ReactStars
                  count={5}
                  isHalf={true}
                  onChange={(starvalue) => changeKitchenRating(starvalue, row)}
                  value={+row.food.favourite}
                  size={24}
                  activeColor="#ffd700"
                />
              </Grid>
            </Grid>
          </CartItem>
        </Grid>,
      ],
      sortable: true,
      width: "20rem",
    },
    {
      name: "Qty",
      selector: (row) => row.no_of_items,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Delivery Date",
      selector: (row) => moment(row.date_time).format("YYYY-MM-DD"),
      sortable: true,
      width: "10rem",
    },
    {
      name: "Order Status",
      selector: (row) => constants.DeliveryType[row.delivery_status],
      sortable: true,
      width: "10rem",
    },
  ];
  const columnsFutureOrder = [
    {
      name: "#",
      selector: (row, index) =>
        index +
        1 +
        tableValuesFutureOrder.perPage * (tableValuesFutureOrder.page - 1),
      grow: 0,
      sortable: true,
    },
    {
      name: "Order ID",
      selector: (row) => row.order.order_reference_number,
      sortable: true,
    },
    {
      name: "Food Name",
      selector: (row) => (row.food.food_name ? row.food.food_name : ""),
      cell: (row) => [
        <Grid xs={12}>
          <CartItem>
            <Grid container>
              <Grid xs={3}>
                <img src={row.food.image_url} alt="food" />
              </Grid>
              <Grid xs={6}>
                <Stack
                  direction={"column"}
                  alignItems="start"
                  justifyContent={"start"}
                  p={1}
                  spacing={"3px"}
                >
                  <Typography component={"div"}>
                    {row.food.food_name}
                  </Typography>
                  <Typography component={"div"}>
                    {/* <ReactStars
                                            count={5}
                                            isHalf={true}
                                             onChange={(value)=>changeFoodRating(value,row)}
                                            size={24}
                                            value={+row.food.rating}
                                            activeColor="#ffd700"
                                            /> */}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </CartItem>
        </Grid>,
      ],

      sortable: true,
      width: "20rem",
    },
    {
      name: "Kitchen Name",
      selector: (row) =>
        row.food.user.kitchen_name ? row.food.user.kitchen_name : "",

      cell: (row) => [
        <Grid>
          <CartItem>
            <Grid container>
              <Grid row xs={12}>
                <Stack
                  direction={"column"}
                  alignItems="start"
                  justifyContent={"start"}
                  p={1}
                  spacing={"3px"}
                >
                  <Typography component={"div"}>
                    {row.food.user.kitchen_name}
                  </Typography>
                </Stack>
              </Grid>
              <Grid row xs={6}>
                <Stack
                  direction={"column"}
                  alignItems="start"
                  justifyContent={"start"}
                  p={1}
                  spacing={"3px"}
                >
                  <Typography component={"div"}>
                    {/* <ReactStars
                                            count={5}
                                            isHalf={true}
                                             onChange={(value)=>changeKitchenRating(value,row)}
                                             value={row.food.favourite}
                                            size={24}
                                            activeColor="#ffd700"
                                            /> */}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </CartItem>
        </Grid>,
      ],
      sortable: true,
      width: "20rem",
    },
    {
      name: "Qty",
      selector: (row) => row.no_of_items,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Delivery Date",
      selector: (row) => moment(row.date_time).format("YYYY-MM-DD HH:mm:ss"),
      sortable: true,
      width: "10rem",
    },
    {
      name: "Cancel Order",
      selector: (row) => constants.DeliveryType[row.delivery_status],
      cell: (row) => [
        <IconButton color="error" onClick={() => CancelOrder(row)}>
          <HighlightOff />
        </IconButton>,
      ],
      sortable: true,
      width: "10rem",
    },
  ];
  const columnsActiveOrder = [
    {
      name: "#",
      selector: (row, index) =>
        index +
        1 +
        tableValuesActiveOrder.perPage * (tableValuesActiveOrder.page - 1),
      grow: 0,
      sortable: true,
    },
  
    {
      name: "Food Name",
      selector: (row) => (row.food.food_name ? row.food.food_name : ""),
      cell: (row) => [
        <Grid xs={12}>
          <CartItem>
            <Grid container>
              <Grid xs={3}>
                <img src={row.food.image_url} alt="food" />
              </Grid>
              <Grid xs={6}>
                <Stack
                  direction={"column"}
                  alignItems="start"
                  justifyContent={"start"}
                  p={1}
                  spacing={"3px"}
                >
                  <Typography component={"div"}>
                    {row.food.food_name}
                  </Typography>
                  <Typography component={"div"}>
                  <ReactStars
                              count={5}
                              isHalf={true}
                              onChange={(starvalue) =>
                                changeFoodRating(starvalue, row)
                              }
                              size={24}
                              value={+row.food.rating}
                              activeColor="#ffd700"
                            />
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </CartItem>
        </Grid>,
      ],

      sortable: true,
      width: "20rem",
    },
    {
      name: "Kitchen Name",
      selector: (row) =>
        row.food.user.kitchen_name ? row.food.user.kitchen_name : "",

      cell: (row) => [
        <Grid>
          <CartItem>
            <Grid container>
              <Grid row xs={12}>
                <Stack
                  direction={"column"}
                  alignItems="start"
                  justifyContent={"start"}
                  p={1}
                  spacing={"3px"}
                >
                  <Typography component={"div"}>
                    {row.food.user.kitchen_name}
                  </Typography>
                </Stack>
              </Grid>
              <Grid row xs={6}>
                <Stack
                  direction={"column"}
                  alignItems="start"
                  justifyContent={"start"}
                  p={1}
                  spacing={"3px"}
                >
                  <Typography component={"div"}>
                  <ReactStars
                              count={5}
                              isHalf={true}
                              onChange={(starvalue) =>
                                changeKitchenRating(starvalue, row)
                              }
                              value={+row.food.favourite}
                              size={24}
                              activeColor="#ffd700"
                  />
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </CartItem>
        </Grid>,
      ],
      sortable: true,
      width: "20rem",
    },
    {
      name: "Qty",
      selector: (row) => row.no_of_items,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Delivery Date",
      selector: (row) => moment(row.date_time).format("YYYY-MM-DD HH:mm:ss"),
      sortable: true,
      width: "10rem",
    },
    {
      name: "Order Status",
      selector: (row) => (constants.DeliveryType[row.delivery_status]),
      sortable: true,
      width: "10rem",
    },
  ];
  
  return (
    <>
      <StyledDialog
        open={popupnState.myOrders}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          My Orders
          <CloseBtn VPosition="top" onClick={handleClose}>
            <CloseIcon />
          </CloseBtn>
        </DialogTitle>
        <StyledDialogContent>
          <Box
            sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: "background.paper" }}
          >
            <Tabs
              value={tabValue}
              onChange={(event, newValue) => {
                setTabValue(newValue);
              }}
              variant="fullWidth"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              <Tab label="Active" {...a11yProps(0)} />
              <Tab label="Upcoming" {...a11yProps(1)} />
              <Tab label="Completed" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <Grid container>
              <Grid item xs={12}>
                <DataTable
                  columns={columnsActiveOrder}
                  data={tableValuesActiveOrder.data}
                  striped
                  pagination
                  paginationServer
                  paginationTotalRows={tableValuesActiveOrder.totalRows}
                  paginationDefaultPage={tableValuesActiveOrder.page}
                  onChangePage={(newPage) => {
                    setTableValuesActiveOrder((prevState) => ({
                      ...prevState,
                      ...{
                        page: newPage,
                      },
                    }));
                  }}
                  onChangeRowsPerPage={(newPerPage, newPage) => {
                    setTableValuesActiveOrder((prevState) => ({
                      ...prevState,
                      ...{
                        page: newPage,
                        perPage: newPerPage,
                      },
                    }));
                  }}
                  subHeader
                  progressPending={tableValuesActiveOrder.processing}
                />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Grid container>
              <Grid item xs={12}>
                <DataTable
                  columns={columnsFutureOrder}
                  data={tableValuesFutureOrder.data}
                  striped
                  pagination
                  paginationServer
                  paginationTotalRows={tableValuesFutureOrder.totalRows}
                  paginationDefaultPage={tableValuesFutureOrder.page}
                  onChangePage={(newPage) => {
                    setTableValuesFutureOrder((prevState) => ({
                      ...prevState,
                      ...{
                        page: newPage,
                      },
                    }));
                  }}
                  onChangeRowsPerPage={(newPerPage, newPage) => {
                    setTableValuesFutureOrder((prevState) => ({
                      ...prevState,
                      ...{
                        page: newPage,
                        perPage: newPerPage,
                      },
                    }));
                  }}
                  subHeader
                  progressPending={tableValuesFutureOrder.processing}
                />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Grid container>
              <Grid item xs={12}>
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
              </Grid>
            </Grid>
          </TabPanel>
        </StyledDialogContent>
      </StyledDialog>
    </>
  );
};

export default MyOrders;

const StyledDialog = styled(Dialog)`
  & .MuiPaper-root {
    width: 95%;
    margin: 0px;
    & .MuiBox-root {
      margin-right: 10px;
      margin-left: 10px;
      background-color: transparent;
      border: none;
    }

    & header {
      display: none;
    }
  }
`;

const StyledDialogContent = styled(DialogContent)`
  padding: 0;
`;
