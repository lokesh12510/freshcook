import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import * as cookService from "../services/cookService";
import url from "../url";
import DataTable from "../../ui/DataTable";
import * as SweetAlert from "../../ui/SweetAlert";

import CheckAccess from "../Auth/checkAccess";
import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import { PrimaryBtn, StyledContainer } from "../../../utils/constants/Styles";
import styled from "styled-components";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import DeleteIcon from "@mui/icons-material/Delete";
import { EditIcon } from "../../../utils/constants/Icons";

export const Index = () => {
  const navigate = useNavigate();

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
      name: "Mobile ",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Email ",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Kitchen Name",
      selector: (row) => row.kitchen_name,
      sortable: true,
    },

    {
      name: "Address",
      selector: (row) => row.address,
      sortable: true,
    },
    {
      name: "City",
      selector: (row) => row.city,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => [
        <CheckAccess request={["ROLE_ADMIN"]}>
          <IconButton onClick={() => editCook(row.id)}>
            <EditIcon />
          </IconButton>
        </CheckAccess>,
        <CheckAccess request={["ROLE_ADMIN"]}>
          <IconButton onClick={() => deleteCook(row.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </CheckAccess>,
      ],
      width: "20%",
    },
  ];

  useEffect(() => {
    getCookList();
  }, [
    tableValues.page,
    tableValues.perPage,
    tableValues.filterText,
    tableValues.search,
  ]);

  const getCookList = () => {
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
    cookService
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
  const editCook = (id) => {
    navigate(`${url.CookEdit}/${id}`);
  };
  const deleteCook = (id) => {
    SweetAlert.deleteConfirm().then((result) => {
      if (result.isConfirmed) {
        cookService
          .Delete(id)
          .then((response) => {
            getCookList();
            SweetAlert.successAlert("Cook deleted successfully");
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
              Home Cook
            </Typography>
            <CheckAccess request={["ROLE_ADMIN"]}>
              <PrimaryBtn
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => navigate(url.CookAdd)}
                startIcon={<AddCircleIcon size="large" />}
              >
                Add
              </PrimaryBtn>
            </CheckAccess>
          </Stack>
          <Divider style={{ marginBlock: 15 }} />
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

const StyledBox = styled(Box)`
  padding: 10px;
`;
