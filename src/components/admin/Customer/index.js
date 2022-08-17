import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import * as customerService from "../services/customerService";
import DataTable from "../../ui/DataTable";
import * as SweetAlert from "../../ui/SweetAlert";
import Search from "./search";
import CheckAccess from "../Auth/checkAccess";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { StyledContainer } from "../../../utils/constants/Styles";

import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

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
  const [show, setShow] = useState(false);
  const [CustomerDetail, setCustomerDetail] = useState({
    name: "",
    email: "",
    contact_number: "",
    status: false,
  });

  const [CustomerAddress, setCustomerAddress] = useState([
    {
      delivery_address: "",
      delivery_latitude: "",
      delivery_longitude: "",
    },
  ]);

  const handleClose = () => {
    setShow(false);
  };

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
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.contact_number,
      sortable: true,
    },
    {
      name: "Delivery Address",
      selector: (row) =>
        row.customer_addresses.map((data) => {
          return `${data.delivery_address}|`;
        }),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row.status != null ? (row.status == 1 ? "Active" : "InActive") : "",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => [
        <CheckAccess request={["ROLE_ADMIN"]}>
          <IconButton onClick={() => showCustomer(row.id)}>
            <RemoveRedEyeIcon />
          </IconButton>
        </CheckAccess>,
        <CheckAccess request={["ROLE_ADMIN"]}>
          <IconButton onClick={() => deleteCustomer(row.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </CheckAccess>,
      ],
      width: "20%",
    },
  ];

  useEffect(() => {
    getCustomerList();
  }, [
    tableValues.page,
    tableValues.perPage,
    tableValues.filterText,
    tableValues.search,
  ]);

  const getCustomerList = () => {
    const data = {
      page: tableValues.page,
      perPage: tableValues.perPage,
      filterText: tableValues.filterText,
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
    customerService
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
  const showCustomer = (id) => {
    customerService.Show(id).then((response) => {
      setShow(true);
      setCustomerDetail(response.data.CustomerDetails);
      setCustomerAddress(response.data.DeliveryDetails);
    });
  };
  const deleteCustomer = (id) => {
    SweetAlert.deleteConfirm().then((result) => {
      if (result.isConfirmed) {
        customerService
          .Delete(id)
          .then((response) => {
            getCustomerList();
            SweetAlert.successAlert("Employee deleted successfully");
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  };

  return (
    <>
      <StyledContainer maxWidth="lg">
        <StyledBox style={{ backgroundColor: "#fff" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5" component="div" fontWeight="bold">
              Customer
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
      <Modal
        show={show}
        backdrop="static"
        keyboard={false}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Customer Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group py-2">
            <label>
              <b>Name : </b>
            </label>
            <label>{CustomerDetail.name}</label>
          </div>
          <div className="form-group py-2">
            <label>
              <b>Email : </b>
            </label>
            <label>{CustomerDetail.email}</label>
          </div>
          <div className="form-group py-2">
            <label>
              <b>Contact Number : </b>
            </label>
            <label>{CustomerDetail.contact_number}</label>
          </div>
          <div className="form-group py-2">
            <label>
              <b>Status : </b>{" "}
            </label>
            <label>
              {CustomerDetail.status != null
                ? CustomerDetail.status == 1
                  ? "Active"
                  : "InActive"
                : ""}
            </label>
          </div>
          <div className="experiemce-details">
            {CustomerAddress.map((input, index) => {
              return (
                <div className="row" key={index}>
                  <div className="form-group py-2 col-md-4">
                    <label>
                      <b>Delivery Address</b>{" "}
                    </label>
                    <p>{input.delivery_address}</p>
                  </div>
                  <div className="form-group py-2 col-md-3">
                    <label>
                      <b>Latitude</b>{" "}
                    </label>
                    <p>{input.delivery_latitude}</p>
                  </div>

                  <div className="form-group py-2 col-md-3">
                    <label>
                      <b>Longitude</b>
                    </label>
                    <p>{input.delivery_latitude}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="button" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const StyledBox = styled(Box)`
  padding: 10px;
`;
