import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";

import * as departmentService from "../services/departmentService";
import DataTable from "../../ui/DataTable";
import * as SweetAlert from "../../ui/SweetAlert";
import Form from "./form";
import Filter from "../Filter";
import CheckAccess from '../Auth/checkAccess';

export const Index = () => {

  // Modal Form
  const modalFormRef = useRef();
  const openModalForm = (id) => {
    if(modalFormRef.current)
    {
      modalFormRef.current.setId(id);
      modalFormRef.current.handleShow();
    }
  }
  
  // DataTable
  const [tableValues, setTableValues] = useState({
    data: [],
    processing: true,
    totalRows: 0,
    page: 1,
    perPage: 10,
    filter: '',
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
      name: 'Department',
      selector: row => row.dep_name,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => ([
        <CheckAccess request={['ROLE_ADMIN', 'ROLE_CHEF']}>
          <FaRegEdit variant="secondary" className="editicon" onClick={() => openModalForm(row.id)} />
        </CheckAccess>,
        <CheckAccess request={['ROLE_ADMIN']}>
          <FaRegTrashAlt variant="primary" className="deleteicon" onClick={() => deleteDepartment(row.id)} />
        </CheckAccess>,
      ]),
      width: '20%',
    },
  ];
  
  const subHeaderComponent = useMemo(() => {
    return (
      <Filter
        filter={ tableValues.filter }
        onFilter={(e) => {
          const { name, value } = e.target;
          setTableValues((prevState) => ({...prevState, ...{
            page: 1,
            [name]: value,
          }}));
        }}
        onClear={() => {
          if(tableValues.filter)
          {
            setTableValues((prevState) => ({...prevState, ...{
              page: 1,
              filter: '',
            }}));
          }
        }}
      />
    );
  }, [tableValues.filter]);

  useEffect(() => {
    getDepartmentList();
  }, [tableValues.page, tableValues.perPage, tableValues.filter]);

  const getDepartmentList = () => {
    const data = {
      page: tableValues.page,
      perPage: tableValues.perPage,
      filter: tableValues.filter,
    };
    setTableValues((prevState) => ({...prevState, ...{
      processing: true,
    }}));
    departmentService.Index(data)
    .then((response) => {
      setTableValues((prevState) => ({...prevState, ...{
        processing: false,
        data: response.data.list,
        totalRows: response.data.total,
      }}));
    })
    .catch((e) => {
      console.log(e);
    });
  };

  // Actions
  const deleteDepartment = (id) => {
    SweetAlert.deleteConfirm().then((result) => {
      if(result.isConfirmed)
      {
        departmentService.Delete(id)
        .then((response) => {
          getDepartmentList();
          SweetAlert.successAlert('Department deleted successfully');
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
            <Col md={6}><h3>Departments</h3></Col>
            <Col md={6} className="text-end">
            <CheckAccess request={['ROLE_ADMIN', 'ROLE_CHEF']}>
              <Button variant="primary" onClick={() => openModalForm('')}>
                Add
              </Button>
            </CheckAccess>
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
              subHeaderComponent={ subHeaderComponent }
              progressPending={ tableValues.processing }      
            />
            </Col>
          </Row>
        </div>
      </Container>

      <div>&nbsp;</div>

      <Form 
        ref={ modalFormRef }
        callback={() => {
          getDepartmentList();       }}
      />
    </>
  );
};