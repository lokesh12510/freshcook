import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { Box } from "@mui/system";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import StaticImages from "../../../utils/constants/Images";
import { CloseBtn } from "../../../utils/constants/Styles";
import {
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import * as actions from "../../../utils/store/actions";
import {
  CartItem,
  SectionBox,
  SectionHeader,
  StyledContainer,
  StyledDivider,
} from "../../../utils/constants/Styles";
import { constants } from "../../../utils/constants";
import moment from "moment";
import ReactStars from "react-rating-stars-component";
import HighlightOff from "@mui/icons-material/HighlightOff";
import * as SweetAlert from "../../ui/SweetAlert";
import { Row, Col } from "react-bootstrap";

import { FaClock, FaMinusCircle, FaPlusCircle, FaTimes } from "react-icons/fa";

import * as myorderService from "../services/myOrdersService";
import DataTable from "../../ui/DataTable";

function TabPanel(props) {
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MyOrders = () => {
  const dispatch = useDispatch();

  const popupnState = useSelector((state) => state.popup);
  const handleClose = () => {
    dispatch(actions.popupMyOrders(false));
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(()=>{
    getOrders();
  },[popupnState.myOrders])

  //code from index.js
  const [activeOrder, setActiveOrder] = useState({ data: [] });
  const [foodRate, setFoodRate] = useState();
  const [foodID, setFoodID] = useState();
  const [KitchenRate, setKitchenRate] = useState();
  const [KitchenID, setKitchenID] = useState();

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

  useEffect(() => {
    if(foodRate)
    {
      updateFoodRating();

    }
  }, [foodRate]);

  useEffect(() => {
    if(KitchenRate)
    {
      updateKitchenRating();

    }
  }, [KitchenRate]);

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
    myorderService.getOrders(data).then((response) => {
      setActiveOrder((prevState) => ({
        ...prevState,
        ...{
          data: response.data.activeOrder,
        },
      }));
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
    let foodID = rowData.food.id;
    setFoodRate(value);
    setFoodID(foodID);
  };
  const changeKitchenRating = (value, rowData) => {
    let kitchenId = rowData.food.chef_id;
    setKitchenRate(value);
    setKitchenID(kitchenId);
  };

  //service call to update food rating
  const updateFoodRating = () => {
    let data = { food_id: "", rating: "" };
    data.food_id = foodID;
    data.rating = foodRate;

    myorderService.updateFoodRating(data).then((response) => {
      getOrders();
    });
  };
  //service call to update food rating
  const updateKitchenRating = () => {
    let data = { kitchen_id: "", rating: "" };
    data.kitchen_id = KitchenID;
    data.rating = KitchenRate;
    myorderService.updateKitchenRating(data).then((response) => {
      getOrders();
    });
  };
  const CancelOrder = (rowData) => {
    SweetAlert.warningAlert("Are you Sure You Want To Cancel The Order").then(
      (result) => {
        if (result.isConfirmed) {
          let data = {};

          data.id = rowData.id;
          myorderService.CancelOrder(data).then((response) => {
            getOrders();
          });
        }
      }
    );
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
                  {/* {row.food.food_name} */}
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
    <div>
      <StyledDialog
        open={popupnState.myOrders}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>My Orders</DialogTitle>
        <StyledDialogContent>
          <Box
            sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: "background.paper" }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              <Tab label="Active" {...a11yProps(0)} />
              <Tab label="Upcoming" {...a11yProps(1)} />
              <Tab label="Completed" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
              <div className="row">
                <Row>
                  <Col md={24}>
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
                  </Col>
                </Row>
              </div>
            {/* <Grid container marginBottom={"20px"}>
              {activeOrder.data && activeOrder.data.length > 0 && (
                <Grid container>
                  {activeOrder.data.map((item, index) => (
                    <Grid item xs={12} key={index}>
                      <CartItem>
                        <Grid container spacing={2}>
                          <Grid item xs={2}>
                            <img
                              style={{ width: "70px", height: "70px" }}
                              src={item.food.image_url}
                              alt="food"
                              width="70px"
                              height="70px"
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant="p" component={"div"}>
                              {item.food.user.kitchen_name}
                            </Typography>
                            <ReactStars
                              count={5}
                              isHalf={true}
                              onChange={(value) =>
                                changeKitchenRating(value, item)
                              }
                              value={+item.food.favourite}
                              size={24}
                              activeColor="#ffd700"
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <Typography component={"div"}>
                              {item.food.food_name}
                            </Typography>
                            <ReactStars
                              count={5}
                              isHalf={true}
                              onChange={(value) =>
                                changeFoodRating(value, item)
                              }
                              size={24}
                              value={+item.food.rating}
                              activeColor="#ffd700"
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant="p" component={"div"}>
                              Qty : {item.no_of_items}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography
                              variant="p"
                              component={"div"}
                              color={"secondary.dark"}
                            >
                              &#8377; {item.price}
                            </Typography>
                          </Grid>

                          <Grid item xs={2}>
                            <Stack
                              direction={"row"}
                              alignItems="center"
                              justifyContent={"center"}
                              style={{ height: "100%" }}
                            >
                              <div className="">
                                {item.date_time && (
                                  <div>
                                    <FaClock />{" "}
                                    {moment(item.date_time).format(
                                      "YYYY-MM-DD HH:mm:ss "
                                    )}
                                  </div>
                                )}
                              </div>
                            </Stack>
                          </Grid>
                          <Grid item xs={2}>
                            <Stack
                              direction={"row"}
                              alignItems="center"
                              justifyContent={"center"}
                              style={{ height: "100%" }}
                              spacing={1}
                            >
                              {constants.DeliveryType[item.delivery_status]}
                            </Stack>
                          </Grid>
                        </Grid>
                      </CartItem>
                    </Grid>
                  ))}
                </Grid>
              )}
              {activeOrder.data.length <= 0 && <Grid>No Current Orders</Grid>}
            </Grid> */}
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Grid>
              <div className="row">
                <Row>
                  <Col md={24}>
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
                  </Col>
                </Row>
              </div>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <div className="row">
              <Row>
                <Col md={24}>
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
            </div>
          </TabPanel>
        </StyledDialogContent>

        <CloseBtn VPosition="top" onClick={handleClose}>
          <CloseIcon />
        </CloseBtn>
      </StyledDialog>
    </div>
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
