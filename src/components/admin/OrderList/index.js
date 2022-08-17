import React, { useEffect, useState, useMemo } from "react";

import * as orderListService from "../services/orderListService";
import url from "../url";
import DataTable from "../../ui/DataTable";
import * as SweetAlert from "../../ui/SweetAlert";
import Search from "./search";
import CheckAccess from "../Auth/checkAccess";
import { Modal } from "react-bootstrap";
import moment from "moment";
import { useSelector } from "react-redux";
import { constants } from "../../../utils/constants";
import parse from "html-react-parser";
import {
  CloseBtn,
  SectionBox,
  StyledContainer,
} from "../../../utils/constants/Styles";
import {
  Box,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
  Grid,
  Button,
  IconButton,
} from "@mui/material";
import styled from "styled-components";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { Close as CloseIcon } from "@mui/icons-material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export const Index = () => {

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

  const [Dates, setDates] = useState({
    today: moment().format("YYYY-MM-DD"),
    secondday: "",
    thirdday: "",
    fourthday: "",
    fifthday: "",
    sixthday: "",
    seventhday: "",
  });

  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [show, setShow] = useState(false);
  const [DeliveryStatus, setDeliveryStatus] = useState();
  const [rowID, setRowID] = useState();
  const [statusChange, setStatusChange] = useState(false);
  const [OrderInfo, setOrderInfo] = useState({
    order_reference_number: "",
    name: "",
    contact_number: "",
    order_date_time: "",
    payment_status: "",
    delivery_status: "",
    total_price: "",
  });
  const [CustomerInfo, setCustomerInfo] = useState({
    name: "",
    contact_number: "",
  });

  const [OrderDetail, setOrderDetail] = useState([
    {
      price: "",
      no_of_items: "",
      food_name: "",
      short_description: "",
      food_type: "",
      food: [],
    },
  ]);
  const conditionalRowStyles = [
    //adding condition to change the color of row based on time
    {
      when: (row) =>
        moment(row.date_time).format("YYYY-MM-DD") ===
          moment().format("YYYY-MM-DD") &&
        convertDate(row.date_time) < moment().format("HH:mm"),
      style: {
        backgroundColor: "rgb(235 98 98)",
        color: "white",
      },
    },
    // You can also pass a callback to style for additional customization
    {
      when: (row) =>
        moment(row.date_time).format("YYYY-MM-DD") ===
          moment().format("YYYY-MM-DD") &&
        convertDate(row.date_time) >= moment().format("HH:mm") &&
        convertDate(row.date_time) < moment().add(2, "hours").format("HH:mm"),
      style: {
        backgroundColor: "#5d5ddd",
        color: "white",
      },
    },
    {
      when: (row) => row.delivery_status == 3,
      style: {
        backgroundColor: "#2fc57f",
        color: "white",
      },
    },
  ];



  const handleClose = () => {
    setShow(false);
  };
  const updateDeliveryStatus = async (orderId, deliverystatus) => {
    orderListService
      .updateDeliveryStatus(orderId, deliverystatus)
      .then((response) => {
        setStatusChange(false);
        getOrderList();
      });
  };

  const handleChange = (e) => {
    setDeliveryStatus(+e.target.value);
    setStatusChange(true);
  };
  useEffect(() => {
    if (statusChange) {
      updateDeliveryStatus(rowID, DeliveryStatus);
    }
  }, [statusChange]);

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
      name: "Order By",
      selector: (row) => (row.order.user ? row.order.user.name : ""),
    },
    {
      name: "Mobile",
      selector: (row) => (row.order.user ? row.order.user.contact_number : ""),
    },
    {
      name: "Delivery Address",
      selector: (row) => (row.order ? row.order.address : ""),
      cell: (row) => [<div>{row.order ? row.order.address : ""}</div>],
      width: "14rem",
    },
    {
      name: "Food",
      selector: (row) => (row.food ? row.food.food_name : ""),
      sortable: true,
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
      name: "Delivery Time",
      selector: (row) => convertDate(row.date_time),
      sortable: true,
      width: "10rem",
    },
    {
      name: "Payment Status",
      selector: (row) =>
        row.order.payment_status != null
          ? row.order.payment_status == 1
            ? "Paid"
            : "Pending"
          : "",
      sortable: true,
    },

    {
      name: "Delivery Status",
      selector: (row) => row.delivery_status,
      cell: (row) => (
        <div>
          <select
            name="status"
            className="form-control status"
            value={+row.delivery_status}
            onClick={() => setRowID(row.id)}
            onChange={handleChange}
          >
            <option value="0" disabled={row.delivery_status}>
              Select Status
            </option>
            <option value="1" disabled={+row.delivery_status > 1}>
              Order Confirmed
            </option>
            <option value="2" disabled={+row.delivery_status > 2}>
              Food Packed
            </option>
            <option
              value="3"
              disabled={+row.delivery_status > 3 || +row.delivery_status == 4}
            >
              Delivered
            </option>
            <option
              value="4"
              disabled={+row.delivery_status > 4 || +row.delivery_status == 3}
            >
              Cancelled
            </option>
          </select>
        </div>
      ),
      sortable: true,
      width: "10rem",
    },

    {
      name: "Actions",
      cell: (row) => [
        <CheckAccess request={["ROLE_ADMIN", "ROLE_CHEF"]}>
          <IconButton onClick={() => showOrderDetails(row.id)}>
            <RemoveRedEyeIcon />
          </IconButton>
        </CheckAccess>,
      ],
      width: "20%",
    },
  ];

  useEffect(() => {
    getOrderList();
  }, [
    tableValues.page,
    tableValues.perPage,
    tableValues.filterText,
    tableValues.search,
    selectedDate,
  ]);

  useEffect(() => {
    const dateList = {};
    dateList.today = moment().format("YYYY-MM-DD");
    const date = new Date();
    dateList.secondday = moment(date.setDate(date.getDate() + 1)).format(
      "YYYY-MM-DD"
    );
    dateList.thirdday = AddDates(dateList.secondday);
    dateList.fourthday = AddDates(dateList.thirdday);

    dateList.fifthday = AddDates(dateList.fourthday);
    dateList.sixthday = AddDates(dateList.fifthday);
    dateList.seventhday = AddDates(dateList.sixthday);
    setDates(dateList);

    //Dates.secondday =
  }, []);

  const AddDates = (nextdate) => {
    const newdate = new Date(nextdate);
    return moment(newdate.setDate(newdate.getDate() + 1)).format("YYYY-MM-DD");
  };

  const convertDate = (deliveryDatetime) => {
    const deliverytime = new Date(deliveryDatetime);
    return moment(deliverytime).format("HH:mm:ss ");
  };

  const getOrderList = () => {
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

    data["orderDate"] = selectedDate;
    setTableValues((prevState) => ({
      ...prevState,
      ...{
        processing: true,
      },
    }));
    orderListService
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
  const showOrderDetails = (id) => {
    let chef_id = 0;
    if (authState.user.role == "ROLE_CHEF") {
      chef_id = authState.user.id;
    }
    orderListService.Show(id, chef_id).then((response) => {
      setOrderInfo(response.data.OrderInfo);
      if (response.data.OrderInfo.user) {
        setCustomerInfo(response.data.OrderInfo.user);
      }

      const orderdetail = response.data.OrderDetail;
      setOrderDetail(orderdetail);

      setShow(true);

   
    });
  };

  const handleSelect = (e, value) => {
    const resettableValues = {};
    resettableValues.page = 1;
    resettableValues.perPage = 10;
    resettableValues.filterText = "";
    resettableValues.search = {};
    setTableValues(resettableValues);

    setSelectedDate(value);

    //.log(eventKey);
  };

  return (
    <>
      <StyledContainer>
        <SectionBox>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5" component="div" fontWeight="bold">
              Order Lists
            </Typography>
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
              />
            </Grid>
          </Grid>

          <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
            <Tabs value={selectedDate} onChange={handleSelect} centered>
              <Tab label={Dates.today} value={Dates.today} />
              <Tab label={Dates.secondday} value={Dates.secondday} />
              <Tab label={Dates.thirdday} value={Dates.thirdday} />
              <Tab label={Dates.fourthday} value={Dates.fourthday} />
              <Tab label={Dates.fifthday} value={Dates.fifthday} />
              <Tab label={Dates.sixthday} value={Dates.sixthday} />
              <Tab label={Dates.seventhday} value={Dates.seventhday} />
            </Tabs>
          </Box>

          <StyledDataTable container>
            <Grid item xs={12}>
              <DataTable
                className="ordersTable"
                columns={columns}
                data={tableValues.data}
                conditionalRowStyles={conditionalRowStyles}
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
          </StyledDataTable>
        </SectionBox>
      </StyledContainer>
      <Dialog open={show} onClose={handleClose} maxWidth="lg">
        <DialogTitle>Order Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container>
              <Grid item xs={12} md={6}>
                <div className="form-group py-3">
                  <label>
                    <b>Order Reference Number :&nbsp;&nbsp; </b>
                  </label>
                  <label>{OrderInfo.order_reference_number}</label>
                </div>
                <div className="form-group py-3">
                  <label>
                    <b>Ordered By :&nbsp;&nbsp; </b>
                  </label>
                  <label>{CustomerInfo.name}</label>
                </div>
                <div className="form-group py-3">
                  <label>
                    <b>Contact Number :&nbsp;&nbsp; </b>
                  </label>
                  <label>{CustomerInfo.contact_number}</label>
                </div>
                <div className="form-group py-3">
                  <label>
                    <b>Ordered Date Time :&nbsp;&nbsp; </b>{" "}
                  </label>
                  <label>
                    {moment(OrderDetail.date_time).format(
                      "YYYY-MM-DD HH:mm:ss "
                    )}
                  </label>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div className="form-group py-3">
                  <label>
                    <b>Payment Status :&nbsp;&nbsp; </b>{" "}
                  </label>
                  <label>
                    {OrderInfo.payment_status != null
                      ? OrderInfo.payment_status == 1
                        ? "Paid"
                        : "Pending"
                      : ""}
                  </label>
                </div>
                <div className="form-group py-3">
                  <label>
                    <b>Delivery Status :&nbsp;&nbsp;</b>{" "}
                  </label>
                  <label>
                    {constants.DeliveryType[OrderDetail.delivery_status]}
                  </label>
                </div>
                <div className="form-group py-3">
                  <label>
                    <b>Customer Address :&nbsp;&nbsp; </b>{" "}
                  </label>
                  <label>{OrderInfo.address}</label>
                </div>
              </Grid>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Food Images</TableCell>
                        <TableCell align="left">Food Name</TableCell>
                        <TableCell align="left">Description</TableCell>
                        <TableCell align="left">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="left">
                          {" "}
                          <img
                            width="200px"
                            height="200px"
                            src={
                              OrderDetail.food
                                ? constants.baseURL + OrderDetail.food.image_url
                                : ""
                            }
                            alt="food"
                          />
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {OrderDetail.food ? OrderDetail.food.food_name : ""}{" "}
                        </TableCell>
                        <TableCell align="left">
                          {parse(
                            OrderDetail.food
                              ? OrderDetail.food.short_description
                              : ""
                          )}
                        </TableCell>
                        <TableCell align="left">{OrderDetail.price}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <CloseBtn VPosition="top" onClick={handleClose}>
          <CloseIcon />
        </CloseBtn>
      </Dialog>
    </>
  );
};

const StyledDataTable = styled(Grid)`
  & header {
    display: none;
  }
  & .rdt_TableRow {
    background-color: #fff;
  }
  & .rdt_TableCell:last-child {
    min-width: 50px;
  }
  & .rdt_TableCol:last-child {
    min-width: 70px;
  }
`;
