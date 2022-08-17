import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";

import * as employeeService from "../services/employeeService";
import url from '../url';
import DataTable from "../../ui/DataTable";
import * as SweetAlert from "../../ui/SweetAlert";
import Search from "./search";
import CheckAccess from '../Auth/checkAccess';

export const Index = () => {
  const navigate = useNavigate();
  
  // DataTable
  const [tableValues, setTableValues] = useState({
    data: [],
    processing: true,
    totalRows: 0,
    page: 1,
    perPage: 10,
    filterText: '',
    search: {},
  });
  
  const columns = [
    {
      name: '#',
      //selector: (row, index) => row.id,
      selector: (row, index) => index + 1 + (tableValues.perPage * (tableValues.page - 1)),
      grow: 0,
      sortable: true,
    },
    {
      name: 'First Name',
      selector: row => row.first_name,
      sortable: true,
    },
    {
      name: 'Last Name',
      selector: row => row.last_name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Gender',
      selector: row => row.gender,
      sortable: true,
    },
    {
      name: 'Skillset',
      selector: row => row.skills,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => ([
        <CheckAccess request={['ROLE_ADMIN', 'ROLE_CHEF']}>
          <FaRegEdit variant="secondary" className="editicon" onClick={() => editEmployee(row.id)} />
        </CheckAccess>,
        <CheckAccess request={['ROLE_ADMIN']}>
          <FaRegTrashAlt variant="primary" className="deleteicon" onClick={() => deleteEmployee(row.id)} />
        </CheckAccess>,
      ]),
      width: '20%',
    },
  ];

  useEffect(() => {
    getEmployeeList();
  }, [tableValues.page, tableValues.perPage, tableValues.filterText, tableValues.search]);

  const getEmployeeList = () => {
    const data = {
      page: tableValues.page,
      perPage: tableValues.perPage,
      filterText: tableValues.filterText,
    };
    Object.keys(tableValues.search).map((key) => {
      data[key] = tableValues.search[key];
      return data;
    });
    setTableValues((prevState) => ({...prevState, ...{
      processing: true,
    }}));
    employeeService.Index(data)
    .then((response) => {
      setTableValues((prevState) => ({...prevState, ...{
        processing: false,
        data: response.data.list,
        totalRows: response.data.total,
      }}));
    }).catch((e) => {
      console.log(e);
    });
  };

  // Actions
  const editEmployee = (id) => {
    navigate(`${url.EmployeeEdit}/${id}`);
  };
  const deleteEmployee = (id) => {
    SweetAlert.deleteConfirm().then((result) => {
      if(result.isConfirmed)
      {
        employeeService.Delete(id)
        .then((response) => {
          getEmployeeList();
          SweetAlert.successAlert('Employee deleted successfully');
        }).catch((e) => {
          console.log(e);
        });
      }
    });
  };


  return (
    <>
      <Container>
        <div className="card">
          <Row>
            <Col md={6}><h3>Employees</h3></Col>
            <Col md={6} className="text-end">
              <CheckAccess request={['ROLE_ADMIN', 'ROLE_CHEF']}>
                <Button variant="primary" onClick={() => navigate(url.EmployeeAdd)}>
                  Add
                </Button>
              </CheckAccess>
            </Col>
        </Row>
        <Row>
            <Col md={12}>
              <Search 
                setData={(search) => {
                  setTableValues((prevState) => ({...prevState, ...{
                    search: search,
                  }}));
                }}
              />
            </Col>
        </Row>
        <Row>
          <Col md={12}>
            <DataTable
              columns={ columns }
              data={ tableValues.data }
              striped
              pagination
              paginationServer
              paginationTotalRows={ tableValues.totalRows }
              paginationDefaultPage={ tableValues.page }
              onChangePage={(newPage) => {
                setTableValues((prevState) => ({...prevState, ...{
                  page: newPage,
                }}));
              }}
              onChangeRowsPerPage={(newPerPage, newPage) => {
                setTableValues((prevState) => ({...prevState, ...{
                  page: newPage,
                  perPage: newPerPage,
                }}));
              }}
              subHeader
              progressPending={ tableValues.processing }      
            />
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
}